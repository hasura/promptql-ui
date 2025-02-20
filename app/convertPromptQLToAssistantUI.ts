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
  if (response.interactions.length === 0) return [];

  // Group actions by index and accumulate their content
  const actionsByIndex = new Map<
    number,
    {
      message: string;
      plan: string | null;
      code: {
        content: string;
        output: string[];
        error?: string;
      } | null;
    }
  >();

  for (const interaction of response.interactions) {
    for (const action of interaction.actions) {
      const index = action.index || 0;

      // Get or create accumulator for this index
      let accumulator = actionsByIndex.get(index);
      if (!accumulator) {
        accumulator = {
          message: "",
          plan: null,
          code: null,
        };
        actionsByIndex.set(index, accumulator);
      }

      // Accumulate content
      if (action.message) {
        accumulator.message += action.message;
      }
      if (action.plan) {
        accumulator.plan = (accumulator.plan || "") + action.plan;
      }
      if (action.code) {
        if (!accumulator.code) {
          accumulator.code = {
            content: "",
            output: [],
            error: undefined,
          };
        }
        accumulator.code.content += action.code.content || "";
        if (action.code.output) {
          accumulator.code.output = action.code.output;
        }
        if (action.code.error) {
          accumulator.code.error = action.code.error;
        }
      }
    }
  }

  // Convert accumulated content to messages
  return Array.from(actionsByIndex.entries())
    .sort(([a], [b]) => a - b)
    .map(([, content]) => {
      const messageParts: (TextContentPart | ToolCallContentPart)[] = [];

      // Add plan if exists
      if (content.plan) {
        messageParts.push({
          type: "tool-call",
          toolName: "plan_display",
          args: { plan: content.plan },
          toolCallId: "plan",
          argsText: JSON.stringify({ args: { plan: content.plan } }),
        });
      }

      // Add code if exists
      if (content.code) {
        messageParts.push({
          type: "tool-call",
          toolName: "code_display",
          args: {
            code: content.code.content,
            output: content.code.output.join("") || "",
            error: content.code.error || "",
          },
          toolCallId: "code",
          argsText: JSON.stringify({
            args: {
              code: content.code.content,
              output: content.code.output.join("") || "",
              error: content.code.error || "",
            },
          }),
        });
      }

      // Add message if exists
      if (content.message) {
        messageParts.push({
          type: "text",
          text: content.message,
        });
      }

      return {
        role: "assistant",
        content: messageParts,
      };
    });
}
