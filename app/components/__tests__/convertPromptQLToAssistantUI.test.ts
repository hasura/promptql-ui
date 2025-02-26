import { describe, it, expect } from "vitest";
import {
  accumulateChunks,
  AssistantActionChunk,
  Chunk,
} from "../../accumulateChunks";
import { convertPromptQLToAssistantUI } from "../../convertPromptQLToAssistantUI";
import { createChunkStream, collectStreamedChunks } from "./testUtils";
import promptQLResponse from "../../../test/mocks/promptql-response.json";
import type {
  TextContentPart,
  ThreadMessageLike,
  ToolCallContentPart,
} from "@assistant-ui/react";

describe("convertPromptQLToAssistantUI", () => {
  it("should convert PromptQL response to Assistant UI format", () => {
    const accumulated = accumulateChunks(promptQLResponse);
    const messages = convertPromptQLToAssistantUI(accumulated);

    expect(messages.length).toBe(2);
    expect(messages[0].role).toBe("assistant");
    expect(messages[0].content.length).toBe(3);

    // Verify plan content
    const planContent = messages[0].content[0] as ToolCallContentPart;
    expect(planContent.type).toBe("tool-call");
    expect(planContent.toolName).toBe("plan_display");
    expect(planContent.args.plan).toContain("Query the tables");

    // Verify code content
    const codeContent = messages[0].content[1] as ToolCallContentPart;
    expect(codeContent.type).toBe("tool-call");
    expect(codeContent.toolName).toBe("code_display");
    expect(codeContent.args.code).toContain("# Get row counts");

    // Verify text content
    const textContent = messages[0].content[2] as TextContentPart;
    expect(textContent.type).toBe("text");
    expect(textContent.text).toContain("I'll help you explore");
  });

  it("should handle empty interactions", () => {
    const messages = convertPromptQLToAssistantUI({ interactions: [] });
    expect(messages).toEqual([]);
  });

  it("should handle code blocks", () => {
    const accumulated = accumulateChunks(promptQLResponse);
    const messages = convertPromptQLToAssistantUI(accumulated);

    const codeContent = messages[0].content[1] as ToolCallContentPart;
    expect(codeContent.type).toBe("tool-call");
    expect(codeContent.toolName).toBe("code_display");
    expect(codeContent.args.code).toContain("# Get row counts");
    expect(codeContent.args.output).toContain("SQL statement returned 1 rows");
  });

  it("should include artifact reference with warning message", () => {
    const accumulated = accumulateChunks(promptQLResponse);
    const messages = convertPromptQLToAssistantUI(accumulated);
    // console.log(JSON.stringify(messages, null, 2));

    // Get the second message (index 1) which contains the artifact reference
    const artifactMessage = messages[1].content[0] as TextContentPart;
    expect(artifactMessage.type).toBe("text");
    expect(artifactMessage.text).toContain(
      "<artifact identifier='schema_overview'"
    );
    expect(artifactMessage.text).toContain(
      "warning='I cannot see the full data so I must not make up observations'"
    );
  });
});

describe("convertPromptQLToAssistantUI streaming", () => {
  it("should convert streamed PromptQL chunks to Assistant UI format", async () => {
    const stream = createChunkStream(
      promptQLResponse as unknown as AssistantActionChunk[]
    );
    const chunks = await collectStreamedChunks(stream);
    const accumulated = accumulateChunks(chunks);
    const messages = convertPromptQLToAssistantUI(accumulated);

    // Should have one message
    expect(messages.length).toBe(2);

    // Check assistant message
    expect(messages[0].role).toBe("assistant");
    expect(messages[0].content.length).toBe(3);

    const textContent = messages[0].content[0] as ToolCallContentPart;
    expect(textContent.type).toBe("tool-call");
    expect(textContent.toolName).toBe("plan_display");
  });
});
