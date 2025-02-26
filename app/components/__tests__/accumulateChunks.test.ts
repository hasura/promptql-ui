import { describe, it, expect } from "vitest";
import promptQLResponse from "../../../test/mocks/promptql-response.json";
import { accumulateChunks, ChunkResponse } from "../../accumulateChunks";
import { createChunkStream, collectStreamedChunks } from "./testUtils";

describe("accumulateChunks", () => {
  it("should accumulate chunks correctly from streamed response", () => {
    const result = accumulateChunks(promptQLResponse);

    // Verify basic structure
    expect(result.interactions.length).toBe(1);
    expect(result.interactions[0].actions.length).toBe(2);

    // Verify first action content
    const action1 = result.interactions[0].actions[0];
    expect(action1.message).toBe(
      "I'll help you explore the Chinook database schema, which appears to be a music store database. Let me create a summary of the main tables and their relationships."
    );
    expect(action1.code?.content).toContain(
      "# Get row counts for each main table"
    );
    expect(action1.code?.output).toEqual(
      Array(11).fill("SQL statement returned 1 rows.\n")
    );

    // Verify second action content
    const action2 = result.interactions[0].actions[1];
    expect(action2.message).toMatch(
      /^Here's an overview of your Chinook database schema:/
    );
  });

  it("should handle streamed chunks correctly", async () => {
    const stream = createChunkStream(promptQLResponse);
    const chunks = await collectStreamedChunks(stream);
    const result = accumulateChunks(chunks);

    // Verify basic structure
    expect(result.interactions.length).toBe(1);
    expect(result.interactions[0].actions.length).toBe(2);

    // Verify first action content
    const action1 = result.interactions[0].actions[0];
    expect(action1.message).toBe(
      "I'll help you explore the Chinook database schema, which appears to be a music store database. Let me create a summary of the main tables and their relationships."
    );
    expect(action1.code?.content).toContain(
      "# Get row counts for each main table"
    );
    expect(action1.code?.output).toEqual(
      Array(11).fill("SQL statement returned 1 rows.\n")
    );

    // Verify second action content
    const action2 = result.interactions[0].actions[1];
    expect(action2.message).toMatch(
      /^Here's an overview of your Chinook database schema:/
    );
  });

  it("should combine simple message chunks with same index", () => {
    // Use first few message chunks from promptql-response
    const chunks = promptQLResponse
      .slice(0, 5)
      .map((line) => JSON.parse(line.replace("data: ", "")));

    const result = accumulateChunks(chunks);

    expect(result.interactions[0].actions[0].message).toBe(
      "I'll help you explore the Chinook database schema, which appears to be a music store database. Let me create a summary of the main tables and their relationships."
    );
  });

  it("should handle code chunks", () => {
    // Get code-related chunks from promptql-response
    const codeChunks = promptQLResponse
      .filter((line) => {
        const chunk = JSON.parse(line.replace("data: ", ""));
        return chunk.code !== null || chunk.code_output !== null;
      })
      .map((line) => JSON.parse(line.replace("data: ", "")));

    const result = accumulateChunks(codeChunks);

    expect(result.interactions[0].actions[0].code).toBeDefined();
    expect(result.interactions[0].actions[0].code?.content).toContain(
      "# Get row counts"
    );
    expect(result.interactions[0].actions[0].code?.output).toEqual(
      Array(11).fill("SQL statement returned 1 rows.\n")
    );
  });

  it("should not duplicate actions during accumulation", () => {
    const chunks = promptQLResponse.map((line) =>
      JSON.parse(line.replace("data: ", ""))
    );

    // Process chunks incrementally
    const results: ChunkResponse[] = [];
    for (let i = 1; i <= chunks.length; i++) {
      results.push(accumulateChunks(chunks.slice(0, i)));
    }

    // Verify no duplicates in final state
    const finalResult = results[results.length - 1];
    expect(finalResult.interactions[0].actions.length).toBe(2);

    // Verify action IDs are unique
    const actionIds = finalResult.interactions[0].actions.map((a) => a.id);
    expect(new Set(actionIds).size).toBe(actionIds.length);
  });
});
