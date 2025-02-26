"use client";

import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ChatModelRunResult,
} from "@assistant-ui/react";
import { ReactNode } from "react";

interface LocalRuntimeProviderProps {
  children: ReactNode;
}

const createModelAdapter = (): ChatModelAdapter => ({
  async *run({ messages, abortSignal }) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((msg) => ({
          role: msg.role,
          content:
            typeof msg.content === "string"
              ? msg.content
              : msg.content
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join(""),
        })),
      }),
      signal: abortSignal,
    });

    if (!response.ok) throw new Error("Chat request failed");
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Track content by index
    const contentByIndex: Record<
      number,
      {
        text: string;
        plan: string;
        code: string;
        codeOutput: string;
      }
    > = {};

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          try {
            const chunk = JSON.parse(line);
            if (chunk.type === "assistant_message_response") {
              const data = {
                message: chunk.message_chunk || "",
                type: "assistant_action_chunk",
                plan: chunk.plan || "",
                code: chunk.code || "",
                code_output: chunk.code_output || "",
                code_error: chunk.code_error || "",
                index: chunk.index || 0,
              };

              const index = data.index;

              // Initialize content for this index if needed
              if (!contentByIndex[index]) {
                contentByIndex[index] = {
                  text: "",
                  plan: "",
                  code: "",
                  codeOutput: "",
                };
              }

              // Accumulate different content types for this index
              if (data.message) contentByIndex[index].text += data.message;
              if (data.plan) contentByIndex[index].plan += data.plan;
              if (data.code) contentByIndex[index].code += data.code;
              if (data.code_output)
                contentByIndex[index].codeOutput += data.code_output;

              // Create content array for all messages up to and including current index
              const allContent: ChatModelRunResult["content"] = Object.entries(
                contentByIndex
              )
                .sort(([a], [b]) => Number(a) - Number(b))
                .flatMap(([, content]) => [
                  ...(content.text
                    ? [{ type: "text" as const, text: content.text }]
                    : []),
                  ...(content.plan
                    ? [
                        {
                          type: "tool-call" as const,
                          toolCallId: "plan-1",
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
                          toolCallId: "code-1",
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

              yield { content: allContent };
            }
          } catch (error) {
            console.warn("Failed to parse line:", line, error);
          }
        }
      }
    }
  },
});

export function LocalRuntimeProvider({ children }: LocalRuntimeProviderProps) {
  const runtime = useLocalRuntime(createModelAdapter());

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
