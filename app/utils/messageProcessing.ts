import { ThreadMessageLike, AppendMessage } from "@assistant-ui/react";
import { Chunk } from "../accumulateChunks";
import { accumulateChunks } from "../accumulateChunks";
import { convertPromptQLToAssistantUI } from "../convertPromptQLToAssistantUI";

export interface MessageProcessor {
  setMessages: (
    updater: (
      messages: readonly ThreadMessageLike[]
    ) => readonly ThreadMessageLike[]
  ) => void;
  messages: readonly ThreadMessageLike[];
}

async function parseSSEChunks(
  response: AsyncIterable<string>
): Promise<AsyncIterable<Chunk>> {
  return {
    [Symbol.asyncIterator]: async function* () {
      for await (const chunk of response) {
        if (chunk.startsWith("data: ")) {
          const data = chunk.slice(6).trim();
          try {
            const parsed = JSON.parse(data);
            yield parsed as Chunk;
          } catch (e) {
            console.error("Failed to parse SSE chunk:", e);
          }
        }
      }
    },
  };
}

export async function processNewMessage(
  message: AppendMessage,
  processor: MessageProcessor,
  getChunks: () => Promise<AsyncIterable<string>>
) {
  if (message.content.length !== 1 || message.content[0]?.type !== "text")
    throw new Error("Only text content is supported");

  const userMessage: ThreadMessageLike = {
    role: "user",
    content: [{ type: "text", text: message.content[0].text }],
  };

  // Initialize with user message
  processor.setMessages(() => [userMessage]);

  const processedChunks: Chunk[] = [];

  try {
    const rawChunks = await getChunks();
    const parsedChunks = await parseSSEChunks(rawChunks);

    for await (const chunk of parsedChunks) {
      processedChunks.push(chunk);
      const accumulated = accumulateChunks(processedChunks);
      const assistantMessages = convertPromptQLToAssistantUI(accumulated);

      // Update messages, keeping the user message and adding/updating assistant message
      processor.setMessages(() => [userMessage, ...assistantMessages]);
    }
  } catch (error) {
    console.error("Error processing chunks:", error);
    processor.setMessages(() => [
      userMessage,
      {
        role: "assistant",
        content: [
          {
            type: "text",
            text: "Sorry, there was an error processing your request.",
          },
        ],
      },
    ]);
  }
}
