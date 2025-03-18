import { NextResponse } from "next/server";

export const maxDuration = 30;

const PROMPTQL_API_KEY = process.env.PROMPTQL_API_KEY!;
const DDN_URL = process.env.DDN_URL!;

interface Message {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const interactions = messages.map((msg: Message) => ({
      user_message: {
        text: msg.content,
      },
      assistant_actions: [],
    }));

    const response = await fetch("https://api.promptql.pro.hasura.io/query", {
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
        artifacts: [],
        system_instructions: "",
        timezone: "America/Los_Angeles",
        interactions,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log(JSON.stringify(errorData));
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
