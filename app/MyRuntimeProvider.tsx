"use client";

import { ThreadMessageLike } from "@assistant-ui/react";
import { AppendMessage } from "@assistant-ui/react";
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import { useState } from "react";
import { PlanToolUI } from "./components/PlanToolUI";

interface TextContent {
  type: "text";
  text: string;
}

interface MessageContent {
  role: string;
  content: string;
}

const convertMessage = (message: ThreadMessageLike) => {
  return message;
};

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [messages, setMessages] = useState<readonly ThreadMessageLike[]>([]);

  const onNew = async (message: AppendMessage) => {
    console.log("New message received:", message);

    if (message.content.length !== 1 || message.content[0]?.type !== "text")
      throw new Error("Only text content is supported");

    const userMessage: ThreadMessageLike = {
      role: "user",
      content: [{ type: "text", text: message.content[0].text }],
    };

    // Create allMessages including the new user message
    const allMessages = [...messages, userMessage];
    console.log("All messages to be sent:", allMessages);

    // Update state with user message
    setMessages(allMessages);

    try {
      const messagePayload = {
        messages: allMessages.map(
          (msg) =>
            ({
              role: msg.role,
              content:
                (msg.content[0] as TextContent)?.text || String(msg.content[0]),
            } as MessageContent)
        ),
      };
      console.log("Sending to API:", messagePayload);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      if (!response.ok) throw new Error("Failed to get response");

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const assistantMessage: ThreadMessageLike = {
        role: "assistant",
        content: [{ type: "text", text: "" }],
      };
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream completed");
          break;
        }

        const chunk = decoder.decode(value);
        console.log("Received chunk:", chunk);

        // Update messages by including all previous content
        setMessages((currentMessages) => {
          const lastMessage = currentMessages[currentMessages.length - 1];
          const currentText = (lastMessage.content[0] as TextContent).text;
          const updatedMessage: ThreadMessageLike = {
            role: "assistant",
            content: [{ type: "text", text: currentText + chunk }],
          };
          console.log("Updating assistant message:", updatedMessage);
          return [...currentMessages.slice(0, -1), updatedMessage];
        });
      }
    } catch (error: unknown) {
      console.error("Chat error:", error);
      const errorMessage: ThreadMessageLike = {
        role: "assistant",
        content: [
          {
            type: "text",
            text: "Sorry, there was an error processing your request.",
          },
        ],
      };
      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    }
  };

  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages,
    setMessages,
    onNew,
    convertMessage,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
      <PlanToolUI />
    </AssistantRuntimeProvider>
  );
}
