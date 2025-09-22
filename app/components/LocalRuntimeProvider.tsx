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
import { useTableau } from "./TableauProvider";
import { createTableauArtifacts } from "../utils/tableauArtifacts";
import type { TableauContext } from "../hooks/useTableauContext";

interface LocalRuntimeProviderProps {
  children: ReactNode;
}

const createPromptQLAdapter = (tableauContext?: TableauContext): ChatModelAdapter => ({
  async *run({ messages, abortSignal }) {
    const artifacts = tableauContext ? createTableauArtifacts(tableauContext) : [];
    
    console.log('🚀 Sending chat request with', artifacts.length, 'Tableau artifacts:', {
      hasTableauContext: !!tableauContext,
      contextInitialized: tableauContext?.isInitialized || false,
      artifactIdentifiers: artifacts.map(a => a.identifier)
    });

    // Log detailed artifact data for debugging
    if (artifacts.length > 0) {
      console.log('📄 Detailed Tableau artifact data being sent to PromptQL:');
      artifacts.forEach((artifact, index) => {
        console.log(`   ${index + 1}. ${artifact.title} (${artifact.identifier}):`, {
          type: artifact.artifact_type,
          dataSize: artifact.data.length,
          sampleData: artifact.data.slice(0, 2) // Show first 2 rows as sample
        });
      });
    }
    
    console.log('🚀 Making request to /api/chat...');
    
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
        artifacts,
      }),
      signal: abortSignal,
    });

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      hasBody: !!response.body
    });

    if (!response.ok) {
      console.error('❌ Response not ok:', response.status, response.statusText);
      throw new Error(`Chat request failed: ${response.status} ${response.statusText}`);
    }
    if (!response.body) {
      console.error('❌ No response body');
      throw new Error("No response body");
    }

    console.log('🔄 Starting to read stream...');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const contentByIndex: Record<number, PromptQLContent> = {};
    let buffer = "";
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      chunkCount++;
      
      if (done) {
        console.log(`✅ Stream completed after ${chunkCount} chunks`);
        break;
      }

      console.log(`📦 Received chunk ${chunkCount}, size: ${value?.length || 0} bytes`);

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
  const tableauContext = useTableau();
  const runtime = useLocalRuntime(createPromptQLAdapter(tableauContext));

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
