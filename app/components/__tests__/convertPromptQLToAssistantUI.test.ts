import { describe, it, expect } from "vitest";
import promptQLChunks from "../../promptql-chunks.json";
import { accumulateChunks, Chunk } from "../../accumulateChunks";
import { convertPromptQLToAssistantUI } from "../../convertPromptQLToAssistantUI";
import { createChunkStream, collectStreamedChunks } from "./testUtils";
import type { TextContentPart, ToolCallContentPart } from "@assistant-ui/react";

describe("convertPromptQLToAssistantUI", () => {
  it("should convert PromptQL chunks to Assistant UI format", () => {
    const accumulated = accumulateChunks(promptQLChunks as Chunk[]);
    const messages = convertPromptQLToAssistantUI(accumulated);

    // Should have 3 messages: user and 2 assistant messages
    expect(messages.length).toBe(3);

    // Check user message
    expect(messages[0]).toEqual({
      role: "user",
      content: [
        {
          type: "text",
          text: "Show me information about my Snowflake Chinook schema",
        },
      ],
    });

    // Check first assistant message (code)
    expect(messages[1].role).toBe("assistant");
    expect(messages[1].content.length).toBe(3);

    // Check plan tool call
    const planContent = messages[1].content[0] as ToolCallContentPart;
    expect(planContent.type).toBe("tool-call");
    expect(planContent.toolName).toBe("plan_display");
    expect(planContent.args.plan).toContain("Query the tables");

    // Check code tool call
    const codeContent = messages[1].content[1] as ToolCallContentPart;
    expect(codeContent.type).toBe("tool-call");
    expect(codeContent.toolName).toBe("code_display");
    expect(codeContent.args.code).toContain("tables = [");
    expect(codeContent.args.output).toContain("SQL statement returned");

    // Check second assistant message (text)
    expect(messages[2].role).toBe("assistant");
    expect(messages[2].content.length).toBe(1);

    const textContent = messages[2].content[0] as TextContentPart;
    expect(textContent.type).toBe("text");
    expect(textContent.text).toContain("Here's an overview");
  });

  it("should handle empty interactions", () => {
    const messages = convertPromptQLToAssistantUI({ interactions: [] });
    expect(messages).toEqual([]);
  });

  it("should handle interactions without user messages", () => {
    const messages = convertPromptQLToAssistantUI({
      interactions: [
        {
          id: "test",
          actions: [
            {
              id: "action1",
              message: "Hello",
            },
          ],
          chunks: [],
        },
      ],
    });

    expect(messages.length).toBe(1);
    expect(messages[0].role).toBe("assistant");

    const textContent = messages[0].content[0] as TextContentPart;
    expect(textContent.type).toBe("text");
  });

  it("should handle query plans in code blocks", () => {
    const messages = convertPromptQLToAssistantUI({
      interactions: [
        {
          id: "test",
          actions: [
            {
              id: "action1",
              code: {
                content: "SELECT * FROM table",
                blockId: "code1",
                query_plan: "Query Plan:\n1. Scan table\n2. Return results",
                output: ["Result"],
              },
            },
          ],
          chunks: [],
        },
      ],
    });

    expect(messages.length).toBe(1);
    expect(messages[0].role).toBe("assistant");
    expect(messages[0].content.length).toBe(2);

    // Check plan tool call
    const planContent = messages[0].content[0] as ToolCallContentPart;
    expect(planContent.type).toBe("tool-call");
    expect(planContent.toolName).toBe("plan_display");
    expect(planContent.args.plan).toBe(
      "Query Plan:\n1. Scan table\n2. Return results"
    );
    expect(planContent.toolCallId).toBe("code1-plan");

    // Check code tool call
    const codeContent = messages[0].content[1] as ToolCallContentPart;
    expect(codeContent.type).toBe("tool-call");
    expect(codeContent.toolName).toBe("code_display");
    expect(codeContent.args.code).toBe("SELECT * FROM table");
  });

  it("should handle code blocks without query plans", () => {
    const messages = convertPromptQLToAssistantUI({
      interactions: [
        {
          id: "test",
          actions: [
            {
              id: "action1",
              code: {
                content: "SELECT * FROM table",
                blockId: "code1",
                output: ["Result"],
              },
            },
          ],
          chunks: [],
        },
      ],
    });

    expect(messages.length).toBe(1);
    expect(messages[0].role).toBe("assistant");
    expect(messages[0].content.length).toBe(1);

    // Should only have code tool call
    const codeContent = messages[0].content[0] as ToolCallContentPart;
    expect(codeContent.type).toBe("tool-call");
    expect(codeContent.toolName).toBe("code_display");
    expect(codeContent.args.code).toBe("SELECT * FROM table");
  });
});

describe("convertPromptQLToAssistantUI streaming", () => {
  it("should convert streamed PromptQL chunks to Assistant UI format", async () => {
    const stream = createChunkStream(promptQLChunks as Chunk[]);
    const chunks = await collectStreamedChunks(stream);
    const accumulated = accumulateChunks(chunks);
    const messages = convertPromptQLToAssistantUI(accumulated);

    // Should have 3 messages: user and 2 assistant messages
    expect(messages.length).toBe(3);

    // Check user message
    expect(messages[0]).toEqual({
      role: "user",
      content: [
        {
          type: "text",
          text: "Show me information about my Snowflake Chinook schema",
        },
      ],
    });

    // Check first assistant message (code)
    expect(messages[1].role).toBe("assistant");
    expect(messages[1].content.length).toBe(3);

    // Check plan tool call
    const planContent = messages[1].content[0] as ToolCallContentPart;
    expect(planContent.type).toBe("tool-call");
    expect(planContent.toolName).toBe("plan_display");
    expect(planContent.args.plan).toContain("Query the tables");

    // Check code tool call
    const codeContent = messages[1].content[1] as ToolCallContentPart;
    expect(codeContent.type).toBe("tool-call");
    expect(codeContent.toolName).toBe("code_display");
    expect(codeContent.args.code).toContain("tables = [");
    expect(codeContent.args.output).toContain("SQL statement returned");

    // Check second assistant message (text)
    expect(messages[2].role).toBe("assistant");
    expect(messages[2].content.length).toBe(1);

    const textContent = messages[2].content[0] as TextContentPart;
    expect(textContent.type).toBe("text");
    expect(textContent.text).toContain("Here's an overview");
  });
});
