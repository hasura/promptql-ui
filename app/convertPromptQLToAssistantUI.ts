import type {
  TextContentPart,
  ThreadMessageLike,
  ToolCallContentPart,
} from "@assistant-ui/react";
import type { ChunkResponse } from "./accumulateChunks";

export interface AccumulatedContent {
  text: string;
  plan: string;
  code: string;
  codeOutput: string;
  codeError: string;
  lastContentType: "text" | "plan" | "code" | null;
}

export function convertPromptQLToAssistantUI(
  response: ChunkResponse
): ThreadMessageLike[] {
  const messages: ThreadMessageLike[] = [];

  for (const interaction of response.interactions) {
    // First, add the user message if it exists
    const userMessage = interaction.chunks.find(
      (chunk) => chunk.type === "user_message"
    );

    if (userMessage && "message" in userMessage) {
      messages.push({
        role: "user",
        content: [{ type: "text", text: userMessage.message }],
      });
    }

    // Process each action in order
    for (const action of interaction.actions) {
      const content: (TextContentPart | ToolCallContentPart)[] = [];

      // Add code content if it exists
      if (action.code) {
        // Add query plan if it exists
        if (action.code.query_plan) {
          content.push({
            type: "tool-call",
            toolName: "plan_display",
            args: {
              plan: action.code.query_plan,
            },
            toolCallId: `${action.code.blockId}-plan`,
            argsText: JSON.stringify({
              args: {
                plan: action.code.query_plan,
              },
            }),
          });
        }

        content.push({
          type: "tool-call",
          toolName: "code_display",
          args: {
            code: action.code.content,
            output: action.code.output?.join("") || "",
            error: "",
          },
          toolCallId: action.code.blockId,
          argsText: JSON.stringify({
            args: {
              code: action.code.content,
              output: action.code.output?.join("") || "",
              error: "",
            },
          }),
        });
      }

      // Add text content if it exists
      if (action.message) {
        content.push({ type: "text", text: action.message });
      }

      // Create a single message for each action, combining all content parts
      if (content.length > 0) {
        messages.push({
          role: "assistant",
          content,
        });
      }
    }
  }

  return messages;
}
