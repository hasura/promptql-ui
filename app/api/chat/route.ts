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
    console.log("Received messages:", messages);

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
              controller.enqueue({ type: "completion" });
              break;
            }

            const text = new TextDecoder().decode(value);
            const lines = text.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const jsonStr = line.slice(6);
                  const originalChunk = JSON.parse(jsonStr);

                  // Transform into expected format
                  const formattedChunk = {
                    type: "assistant_message_response",
                    assistant_action_id:
                      originalChunk.assistant_action_id || "",
                    message_chunk: originalChunk.message || "",
                    plan: originalChunk.plan || "",
                    code: originalChunk.code || "",
                    code_output: originalChunk.code_output || "",
                    code_error: originalChunk.code_error || "",
                    index: originalChunk.index || 0,
                  };

                  controller.enqueue(formattedChunk);
                } catch (e) {
                  console.error("Error parsing chunk:", e);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    // Use TransformStream to convert objects to JSON strings
    const jsonStream = stream.pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(JSON.stringify(chunk) + "\n");
        },
      })
    );

    return new Response(jsonStream, {
      headers: {
        "Content-Type": "application/json",
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
