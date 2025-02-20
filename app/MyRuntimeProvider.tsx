"use client";

import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type ThreadMessageLike,
  type AppendMessage,
} from "@assistant-ui/react";
import { useState } from "react";
import { processNewMessage } from "./utils/messageProcessing";
import type { ReactNode } from "react";

export function MyRuntimeProvider({
  children,
  initialMessages = [],
}: Readonly<{
  children: ReactNode;
  initialMessages?: ThreadMessageLike[];
}>) {
  const [messages, setMessages] =
    useState<readonly ThreadMessageLike[]>(initialMessages);

  const onNew = async (message: AppendMessage) => {
    const getChunks = async function* () {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, message].map((msg) => ({
            role: msg.role,
            content:
              typeof msg.content === "string"
                ? msg.content
                : msg.content
                    .map((part) => (part.type === "text" ? part.text : ""))
                    .join(""),
          })),
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      for await (const chunk of streamResponse(reader, decoder)) {
        if (chunk.type === "assistant_message_response") {
          yield `data: ${JSON.stringify({
            message: chunk.message_chunk || "",
            type: "assistant_action_chunk",
            plan: chunk.plan || "",
            code: chunk.code || "",
            code_output: chunk.code_output || "",
            code_error: chunk.code_error || "",
            index: chunk.index,
          })}\n\n`;
        }
      }
    };

    await processNewMessage(message, { messages, setMessages }, () =>
      Promise.resolve(getChunks())
    );
  };

  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages,
    setMessages,
    onNew,
    convertMessage: (msg) => msg,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

async function* streamResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder
) {
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
          yield JSON.parse(line);
        } catch (e) {
          console.error("Failed to parse line:", line, e);
        }
      }
    }
  }

  if (buffer.trim()) {
    try {
      yield JSON.parse(buffer);
    } catch (e) {
      console.error("Failed to parse remaining buffer:", buffer, e);
    }
  }
}
