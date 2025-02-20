"use client";

import {
  ThreadMessageLike,
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  AppendMessage,
} from "@assistant-ui/react";
import { useState } from "react";
import { processNewMessage } from "../utils/messageProcessing";

interface MockRuntimeProviderProps {
  children: React.ReactNode;
  initialMessages?: ThreadMessageLike[];
  sampleChunks?: string[];
}

export function MockRuntimeProvider({
  children,
  initialMessages = [],
  sampleChunks = [],
}: MockRuntimeProviderProps) {
  const [messages, setMessages] =
    useState<readonly ThreadMessageLike[]>(initialMessages);

  const onNew = async (message: AppendMessage) => {
    const getChunks = () =>
      Promise.resolve(
        (async function* () {
          for (const chunk of sampleChunks) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            yield chunk;
          }
        })()
      );

    await processNewMessage(message, { messages, setMessages }, getChunks);
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
