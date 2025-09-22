import { NextResponse } from "next/server";

export const maxDuration = 30;

const PROMPTQL_API_URL = process.env.PROMPTQL_API_URL!;
const PROMPTQL_API_KEY = process.env.PROMPTQL_API_KEY!;
const DDN_URL = process.env.DDN_URL!;

interface Message {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, artifacts = [] } = await req.json();
    
    console.log('📨 API: Received chat request with artifacts:', {
      messageCount: messages.length,
      artifactCount: artifacts.length,
      artifactTypes: artifacts.map((a: { identifier: string; title: string; artifact_type: string; data?: unknown[] }) => ({
        identifier: a.identifier,
        title: a.title,
        type: a.artifact_type,
        dataRows: a.data?.length || 0
      }))
    });

    // Check environment variables
    console.log('🔧 Environment check:', {
      hasPromptQLApiUrl: !!PROMPTQL_API_URL,
      hasPromptQLApiKey: !!PROMPTQL_API_KEY,
      hasDDNUrl: !!DDN_URL,
      hasDDNToken: !!process.env.DDN_TOKEN,
      promptqlApiUrl: PROMPTQL_API_URL?.substring(0, 50) + '...',
    });

    const interactions = messages.map((msg: Message) => ({
      user_message: {
        text: msg.content,
      },
      assistant_actions: [],
    }));

    const response = await fetch(PROMPTQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-ddn-token": process.env.DDN_TOKEN!,
      },
      body: JSON.stringify({
        version: "v1",
        promptql_api_key: PROMPTQL_API_KEY,
        llm: {
          provider: "hasura",
        },
        ddn: {
          url: DDN_URL,
          headers: {
            "x-hasura-ddn-token": process.env.DDN_TOKEN!,
          },
        },
        artifacts,
        system_instructions: "",
        timezone: "America/Los_Angeles",
        interactions,
        stream: true,
      }),
    });

    console.log('📡 PromptQL API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('❌ PromptQL API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(
        `PromptQL API request failed with status ${response.status}: ${
          errorData ? JSON.stringify(errorData) : response.statusText
        }`
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");
        console.log("Stream started");

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("Stream completed");
              controller.close();
              break;
            }

            // Directly relay the chunks without transformation
            controller.enqueue(value);
          }
        } finally {
          reader.releaseLock();
        }
      },
    });

    // Return the stream directly without transformation
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
