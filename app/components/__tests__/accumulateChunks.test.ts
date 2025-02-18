import { describe, it, expect } from "vitest";
import promptQLChunks from "../../promptql-chunks.json";
import { accumulateChunks, Chunk } from "../../accumulateChunks";
import { createChunkStream, collectStreamedChunks } from "./testUtils";

describe("accumulateChunks", () => {
  it("should accumulate chunks correctly", () => {
    const result = accumulateChunks(promptQLChunks as Chunk[]);

    // Verify basic structure
    expect(result.interactions.length).toBe(1);
    expect(result.interactions[0].actions.length).toBe(2);

    // Verify first action (code)
    const firstAction = result.interactions[0].actions[0];
    expect(firstAction.code).toBeDefined();
    expect(firstAction.code?.artifacts?.length).toBe(1);
    expect(firstAction.code?.output?.length).toBeGreaterThan(0);
    expect(firstAction.code?.content).toContain("tables = [");
    expect(firstAction.code?.output?.join("")).toContain(
      "SQL statement returned"
    );
    // Verify query plan
    expect(firstAction.code?.query_plan).toBeDefined();
    expect(firstAction.code?.query_plan).toContain(
      "Query the tables to get a high-level overview"
    );

    // Verify second action (message)
    const secondAction = result.interactions[0].actions[1];
    expect(secondAction.message).toBeDefined();
    expect(secondAction.message).toBe(
      "Here's an overview of your Chinook database schema:\n<artifact identifier='schema_overview' warning='I cannot see the full data so I must not make up observations' />\n\nThis is a music store database with several key components:\n1. Music catalog: ARTIST → ALBUM → TRACK hierarchy\n2. Sales: CUSTOMER → INVOICE → INVOICELINE structure\n3. Playlists: PLAYLIST and PLAYLISTTRACK for organizing tracks\n4. Supporting data: GENRE and MEDIATYPE for track categorization\n5. Staff: EMPLOYEE table with reporting hierarchy\n\nWould you like to explore any particular aspect of this schema in more detail?"
    );
  });

  it("should handle streamed chunks correctly", async () => {
    const stream = createChunkStream(promptQLChunks as Chunk[]);
    const chunks = await collectStreamedChunks(stream);
    const result = accumulateChunks(chunks);

    // Verify basic structure
    expect(result.interactions.length).toBe(1);
    expect(result.interactions[0].actions.length).toBe(2);

    // Verify first action (code)
    const firstAction = result.interactions[0].actions[0];
    expect(firstAction.code).toBeDefined();
    expect(firstAction.code?.artifacts?.length).toBe(1);
    expect(firstAction.code?.output?.length).toBeGreaterThan(0);
    expect(firstAction.code?.content).toContain("tables = [");
    expect(firstAction.code?.output?.join("")).toContain(
      "SQL statement returned"
    );
    // Verify query plan in streamed chunks
    expect(firstAction.code?.query_plan).toBeDefined();
    expect(firstAction.code?.query_plan).toContain(
      "Query the tables to get a high-level overview"
    );

    // Verify second action (message)
    const secondAction = result.interactions[0].actions[1];
    expect(secondAction.message).toBeDefined();
    expect(secondAction.message).toBe(
      "Here's an overview of your Chinook database schema:\n<artifact identifier='schema_overview' warning='I cannot see the full data so I must not make up observations' />\n\nThis is a music store database with several key components:\n1. Music catalog: ARTIST → ALBUM → TRACK hierarchy\n2. Sales: CUSTOMER → INVOICE → INVOICELINE structure\n3. Playlists: PLAYLIST and PLAYLISTTRACK for organizing tracks\n4. Supporting data: GENRE and MEDIATYPE for track categorization\n5. Staff: EMPLOYEE table with reporting hierarchy\n\nWould you like to explore any particular aspect of this schema in more detail?"
    );
  });
});
