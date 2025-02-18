// import { openai } from "@ai-sdk/openai";
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
    console.log("Transformed interactions:", interactions);

    const response = await fetch("https://api.promptql.pro.hasura.io/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "v1",
        promptql_api_key: PROMPTQL_API_KEY,
        llm: {
          provider: "hasura",
        },
        ddn: {
          url: DDN_URL,
          headers: {},
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
      console.log(errorData);
      throw new Error(
        `PromptQL API request failed with status ${response.status}: ${
          errorData ? JSON.stringify(errorData) : response.statusText
        }`
      );
    }

    // Set up streaming response
    const encoder = new TextEncoder();
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
              break;
            }

            // Parse the SSE data
            const text = new TextDecoder().decode(value);
            console.log("Received chunk:", text);
            const lines = text.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6);
                try {
                  const chunk = JSON.parse(jsonStr);
                  if (
                    chunk.type === "assistant_action_chunk" &&
                    chunk.message
                  ) {
                    controller.enqueue(encoder.encode(chunk.message));
                  }
                } catch {
                  console.warn("Failed to parse chunk:", jsonStr);
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

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
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
