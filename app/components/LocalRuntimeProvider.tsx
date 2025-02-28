"use client";

import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { ReactNode } from "react";
import {
  accumulatePromptQLContent,
  convertToAssistantContent,
  type PromptQLContent,
} from "../utils/contentProcessor";

interface LocalRuntimeProviderProps {
  children: ReactNode;
}

const createPromptQLAdapter = (): ChatModelAdapter => ({
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
    const contentByIndex: Record<number, PromptQLContent> = {};
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Split by newlines while preserving any partial line at the end
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last partial line in the buffer

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        const jsonLine = line.replace("data: ", "").trim();
        try {
          const data = JSON.parse(jsonLine);
          const allContent = accumulatePromptQLContent(contentByIndex, data);
          const assistantContent = convertToAssistantContent(allContent);

          if (data.type === "artifact_update_chunk" && data.artifact) {
            if (data.type === "artifact_update_chunk") {
              console.log(data);
            }
            yield {
              content: assistantContent,
              artifact: data.artifact,
            };
          } else {
            yield { content: assistantContent };
          }
        } catch (e) {
          console.error("Error processing chunk:", e);
        }
      }
    }

    // Process any remaining data in the buffer
    if (buffer.trim() && buffer.startsWith("data: ")) {
      try {
        const jsonLine = buffer.replace("data: ", "").trim();
        console.log(jsonLine);
        const data = JSON.parse(jsonLine);
        const allContent = accumulatePromptQLContent(contentByIndex, data);
        const assistantContent = convertToAssistantContent(allContent);

        if (data.type === "artifact_update_chunk" && data.artifact) {
          yield {
            content: assistantContent,
            artifact: data.artifact,
          };
        } else {
          yield { content: assistantContent };
        }
      } catch (e) {
        console.error("Error processing final chunk:", e);
      }
    }
  },
});

export function LocalRuntimeProvider({ children }: LocalRuntimeProviderProps) {
  const runtime = useLocalRuntime(createPromptQLAdapter());

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
