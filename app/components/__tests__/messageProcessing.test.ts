import { describe, it, expect, vi } from "vitest";
import { processNewMessage } from "../../utils/messageProcessing";
import promptQLResponse from "../../../test/mocks/promptql-response.json";
import type {
  ThreadMessageLike,
  AppendMessage,
  ToolCallContentPart,
  TextContentPart,
} from "@assistant-ui/react";
import { createChunkStream } from "./testUtils";

describe("processNewMessage", () => {
  it("should process a user message and stream assistant response", async () => {
    const messages: ThreadMessageLike[] = [];
    const processor = {
      setMessages: vi.fn((updater) => {
        messages.splice(0, messages.length, ...updater(messages));
      }),
      messages,
    };

    const message: AppendMessage = {
      role: "user",
      content: [{ type: "text", text: "Tell me about the schema" }],
      parentId: null,
      sourceId: null,
      runConfig: undefined,
      attachments: [],
    };

    const getChunks = () =>
      Promise.resolve(
        (async function* () {
          for (const chunk of promptQLResponse) {
            yield chunk;
          }
        })()
      );

    await processNewMessage(message, processor, getChunks);

    expect(messages.length).toBe(3);

    // Verify user message
    expect(messages[0]).toEqual({
      role: "user",
      content: [{ type: "text", text: "Tell me about the schema" }],
    });

    // Verify final assistant message structure
    expect(messages[1].role).toBe("assistant");
    expect(messages[1].content.length).toBe(3);
    expect((messages[1].content[0] as ToolCallContentPart).type).toBe(
      "tool-call"
    );
    expect((messages[1].content[0] as ToolCallContentPart).toolName).toBe(
      "plan_display"
    );
    expect((messages[1].content[1] as ToolCallContentPart).type).toBe(
      "tool-call"
    );
    expect((messages[1].content[1] as ToolCallContentPart).toolName).toBe(
      "code_display"
    );
    expect((messages[1].content[2] as TextContentPart).type).toBe("text");
  });

  it("should handle errors during chunk processing", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const messages: ThreadMessageLike[] = [];
    const processor = {
      setMessages: vi.fn((updater) => {
        messages.splice(0, messages.length, ...updater(messages));
      }),
      messages,
    };

    const message: AppendMessage = {
      role: "user",
      content: [{ type: "text", text: "Hello" }],
      parentId: null,
      sourceId: null,
      runConfig: undefined,
      attachments: [],
    };

    const getChunks = async () => {
      throw new Error("Network error");
    };

    await processNewMessage(message, processor, getChunks);

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error processing chunks:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();

    // Should have 2 messages (user + error)
    expect(messages.length).toBe(2);

    // Verify user message
    expect(messages[0]).toEqual({
      role: "user",
      content: [{ type: "text", text: "Hello" }],
    });

    // Verify error message
    expect(messages[1]).toEqual({
      role: "assistant",
      content: [
        {
          type: "text",
          text: "Sorry, there was an error processing your request.",
        },
      ],
    });
  });

  it("should throw error for non-text content", async () => {
    const processor = {
      setMessages: vi.fn(),
      messages: [],
    };

    const message: AppendMessage = {
      role: "user",
      content: [{ type: "image" as const, image: "test.jpg" }],
      parentId: null,
      sourceId: null,
      runConfig: undefined,
      attachments: [],
    };

    // Convert AssistantActionChunk to string in createChunkStream
    const getChunks = () =>
      Promise.resolve({
        [Symbol.asyncIterator]: async function* () {
          const stream = await createChunkStream([]);
          for await (const chunk of stream) {
            yield JSON.stringify(chunk);
          }
        },
      });

    await expect(
      processNewMessage(message, processor, getChunks)
    ).rejects.toThrow("Only text content is supported");
  });

  it.skip("should not duplicate messages during streaming", () => {
    // ... existing test ...
  });
});
