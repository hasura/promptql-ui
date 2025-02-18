"use client";

import {
  ThreadMessageLike,
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  AppendMessage,
} from "@assistant-ui/react";
import { useState } from "react";
import { accumulateChunks, type Chunk } from "../accumulateChunks";
import { convertPromptQLToAssistantUI } from "../convertPromptQLToAssistantUI";
import promptQLChunks from "../promptql-chunks.json";

interface MockRuntimeProviderProps {
  children: React.ReactNode;
  initialMessages?: ThreadMessageLike[];
  sampleChunks?: Chunk[];
}

export function MockRuntimeProvider({
  children,
  initialMessages = [],
  sampleChunks = promptQLChunks as Chunk[],
}: MockRuntimeProviderProps) {
  const [messages, setMessages] =
    useState<readonly ThreadMessageLike[]>(initialMessages);

  const onNew = async (message: AppendMessage) => {
    if (message.content.length !== 1 || message.content[0]?.type !== "text")
      throw new Error("Only text content is supported");

    const userMessage: ThreadMessageLike = {
      role: "user",
      content: [{ type: "text", text: message.content[0].text }],
    };

    // Add user message first
    setMessages((msgs) => [...msgs, userMessage]);

    // Create initial assistant message
    const initialAssistantMessage: ThreadMessageLike = {
      role: "assistant",
      content: [],
    };
    setMessages((msgs) => [...msgs, initialAssistantMessage]);

    // Process chunks with delay to simulate streaming
    const processedChunks: Chunk[] = [];
    for (const chunk of sampleChunks) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      processedChunks.push(chunk);

      const accumulated = accumulateChunks(processedChunks);
      const newMessages = convertPromptQLToAssistantUI(accumulated);

      // Update all messages after the user message
      if (newMessages.length > 1) {
        setMessages((msgs) => [
          ...msgs.slice(0, -newMessages.length + 1),
          ...newMessages.slice(1),
        ]);
      }
    }
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
