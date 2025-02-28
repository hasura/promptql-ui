import { describe, it, expect } from "vitest";
import {
  accumulatePromptQLContent,
  convertToAssistantContent,
  type PromptQLContent,
} from "../contentProcessor";
import promptQLResponse from "../../../test/mocks/promptql-response.json";

const chunks = promptQLResponse.map((chunk) =>
  JSON.parse(chunk.replace("data: ", ""))
);

describe("contentProcessor", () => {
  describe("accumulatePromptQLContent", () => {
    it("should convert PromptQLContent to ThreadAssistantContentPart array", () => {
      const contentByIndex: Record<number, PromptQLContent> = {};

      // Process each chunk
      let finalContent: PromptQLContent[] = [];
      chunks.forEach((chunk) => {
        finalContent = accumulatePromptQLContent(contentByIndex, chunk);
      });

      expect(finalContent).toHaveLength(2);
      expect(finalContent[0]).toEqual({
        text: "I'll help you explore the Chinook database schema, which appears to be a music store database. Let me create a summary of the main tables and their relationships.",
        plan: "1. Query the tables to get a high-level overview of the data volume in each table\n2. Create a summary showing:\n   - Table name\n   - Number of rows\n   - Key columns\n3. Store this information in an artifact for easy reference",
        code: `# Get row counts for each main table
tables = [
    'ALBUM', 'ARTIST', 'CUSTOMER', 'EMPLOYEE', 'GENRE', 
    'INVOICE', 'INVOICELINE', 'MEDIATYPE', 'PLAYLIST', 
    'PLAYLISTTRACK', 'TRACK'
]

table_stats = []
for table in tables:
    sql = f"SELECT COUNT(1) as count FROM app.CHINOOK_PUBLIC_{table}"
    result = executor.run_sql(sql)
    count = result[0]['count'] if result else 0
    
    table_stats.append({
        'Table': table,
        'Row Count': count,
        'Description': {
            'ALBUM': 'Contains album information including title and artist',
            'ARTIST': 'List of artists',
            'CUSTOMER': 'Customer details including contact information',
            'EMPLOYEE': 'Employee information including hierarchy',
            'GENRE': 'Music genres',
            'INVOICE': 'Sales invoices',
            'INVOICELINE': 'Individual line items of each invoice',
            'MEDIATYPE': 'Types of media (e.g., MPEG audio, AAC audio)',
            'PLAYLIST': 'Named playlists',
            'PLAYLISTTRACK': 'Tracks in each playlist',
            'TRACK': 'Individual songs/tracks with details'
        }[table]
    })

executor.store_artifact(
    'schema_overview',
    'Chinook Database Schema Overview',
    'table',
    table_stats
)`,
        codeOutput: `SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
SQL statement returned 1 rows.
Stored table artifact: identifier = 'schema_overview', title = 'Chinook Database Schema Overview', number of rows = 11, sample rows = [{'Table': 'ALBUM', 'Row Count': 347, 'Description': 'Contains album information including title and artist'}, {'Table': 'ARTIST', 'Row Count': 275, 'Description': 'List of artists'}]
`,
        artifacts: [
          {
            identifier: "schema_overview",
            title: "Chinook Database Schema Overview",
            artifact_type: "table",
            data: [
              {
                Table: "ALBUM",
                "Row Count": 347,
                Description:
                  "Contains album information including title and artist",
              },
              {
                Table: "ARTIST",
                "Row Count": 275,
                Description: "List of artists",
              },
              {
                Description: "Customer details including contact information",
                "Row Count": 109,
                Table: "CUSTOMER",
              },
              {
                Description: "Employee information including hierarchy",
                "Row Count": 8,
                Table: "EMPLOYEE",
              },
              {
                Description: "Music genres",
                "Row Count": 26,
                Table: "GENRE",
              },
              {
                Description: "Sales invoices",
                "Row Count": 614,
                Table: "INVOICE",
              },
              {
                Description: "Individual line items of each invoice",
                "Row Count": 2240,
                Table: "INVOICELINE",
              },
              {
                Description: "Types of media (e.g., MPEG audio, AAC audio)",
                "Row Count": 5,
                Table: "MEDIATYPE",
              },
              {
                Description: "Named playlists",
                "Row Count": 18,
                Table: "PLAYLIST",
              },
              {
                Description: "Tracks in each playlist",
                "Row Count": 8715,
                Table: "PLAYLISTTRACK",
              },
              {
                Description: "Individual songs/tracks with details",
                "Row Count": 3503,
                Table: "TRACK",
              },
            ],
          },
        ],
      });
      expect(finalContent[1]).toEqual({
        text: `Here's an overview of your Chinook database schema:
<artifact identifier='schema_overview' warning='I cannot see the full data so I must not make up observations' />

This is a music store database with several interconnected tables:
- The core music data is stored in ALBUM, ARTIST, TRACK, and GENRE tables
- Customer transactions are tracked in INVOICE and INVOICELINE tables
- PLAYLIST and PLAYLISTTRACK tables manage music playlists
- CUSTOMER and EMPLOYEE tables handle user and staff information

Would you like to explore any specific aspect of this schema in more detail?`,
        plan: "",
        code: "",
        codeOutput: "",
        artifacts: [],
      });
    });

    it("should accumulate content including artifacts", () => {
      const contentByIndex: Record<number, PromptQLContent> = {};

      // Process each chunk
      let finalContent: PromptQLContent[] = [];
      chunks.forEach((chunk) => {
        finalContent = accumulatePromptQLContent(contentByIndex, chunk);
      });

      expect(finalContent).toHaveLength(2);
      expect(finalContent[0].artifacts).toHaveLength(1);
      expect(finalContent[0].artifacts[0]).toMatchObject({
        identifier: "schema_overview",
        title: "Chinook Database Schema Overview",
        artifact_type: "table",
        data: expect.arrayContaining([
          expect.objectContaining({
            Table: "ALBUM",
            "Row Count": 347,
          }),
        ]),
      });
    });
  });

  describe("convertToAssistantContent", () => {
    it("should convert PromptQLContent to ThreadAssistantContentPart array including artifacts", () => {
      const contentByIndex: Record<number, PromptQLContent> = {};
      let finalContent: PromptQLContent[] = [];
      chunks.forEach((chunk) => {
        finalContent = accumulatePromptQLContent(contentByIndex, chunk);
      });

      const result = convertToAssistantContent(finalContent);

      expect(result).toHaveLength(5); // Updated to include artifact
      expect(result[3]).toMatchObject({
        type: "tool-call",
        toolCallId: "artifact-1-1",
        toolName: "artifact_display",
        args: {
          artifact: expect.objectContaining({
            identifier: "schema_overview",
            title: "Chinook Database Schema Overview",
          }),
          plan: null,
          code: null,
          codeOutput: null,
        },
      });
    });
  });
});
