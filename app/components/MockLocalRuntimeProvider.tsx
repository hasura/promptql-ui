"use client";

import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ThreadAssistantContentPart,
} from "@assistant-ui/react";
import { ReactNode } from "react";

interface MockLocalRuntimeProviderProps {
  children: ReactNode;
  sampleChunks?: string[];
}

const createMockModelAdapter = (sampleChunks: string[]): ChatModelAdapter => ({
  async *run({ messages, abortSignal }) {
    console.log("messages", messages);
    // Track content by index with an array for sequential access
    const contentArray: Array<{
      text: string;
      plan: string;
      code: string;
      codeOutput: string;
    }> = [];

    // Simulate streaming responses using the sample chunks
    for (const chunk of sampleChunks) {
      if (abortSignal?.aborted) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const data = JSON.parse(chunk.replace("data: ", ""));
        const index = data.index ?? 0;

        // Initialize content for this index if needed
        if (!contentArray[index]) {
          contentArray[index] = {
            text: "",
            plan: "",
            code: "",
            codeOutput: "",
          };
        }

        // Get current content for this index
        const content = contentArray[index];

        // Update content using nullish coalescing
        content.text += data.message ?? "";
        content.plan += data.plan ?? "";
        content.code += data.code ?? "";
        content.codeOutput += data.code_output ?? "";

        // Build content parts array for all indexes
        const allContentParts: ThreadAssistantContentPart[] =
          contentArray.flatMap((content, idx) => [
            ...(content.text
              ? [
                  {
                    type: "text" as const,
                    text: content.text,
                  },
                ]
              : []),
            ...(content.plan
              ? [
                  {
                    type: "tool-call" as const,
                    toolCallId: `plan-${idx + 1}`,
                    toolName: "plan_display",
                    args: {
                      plan: content.plan,
                      code: null,
                      codeOutput: null,
                    } as const,
                    argsText: content.plan,
                  },
                ]
              : []),
            ...(content.code
              ? [
                  {
                    type: "tool-call" as const,
                    toolCallId: `code-${idx + 1}`,
                    toolName: "code_display",
                    args: {
                      code: content.code,
                      codeOutput: content.codeOutput,
                      plan: null,
                    } as const,
                    argsText: `${content.code}\n${content.codeOutput}`,
                  },
                ]
              : []),
          ]);

        // Handle artifact updates
        if (data.type === "artifact_update_chunk" && data.artifact) {
          yield {
            content: allContentParts,
            artifact: data.artifact,
          };
        } else {
          yield { content: allContentParts };
        }
      } catch (error) {
        console.warn("Failed to parse chunk:", chunk, error);
      }
    }
  },
});

export function MockLocalRuntimeProvider({
  children,
  sampleChunks = [],
}: MockLocalRuntimeProviderProps) {
  const runtime = useLocalRuntime(createMockModelAdapter(sampleChunks));

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
