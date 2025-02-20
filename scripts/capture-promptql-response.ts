import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROMPTQL_API_KEY = process.env.PROMPTQL_API_KEY!;
const DDN_URL = process.env.DDN_URL!;

async function captureResponse() {
  const messages = [
    {
      role: "user",
      content: "Show me information about my Snowflake Chinook schema",
    },
  ];

  const interactions = messages.map((msg) => ({
    user_message: {
      text: msg.content,
    },
    assistant_actions: [],
  }));

  const response = await fetch("https://api.promptql.pro.hasura.io/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "v1",
      promptql_api_key: PROMPTQL_API_KEY,
      llm: {
        provider: "hasura",
      },
      ddn: {
        url: DDN_URL,
        headers: {},
      },
      artifacts: [],
      system_instructions: "",
      timezone: "America/Los_Angeles",
      interactions,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed with status ${response.status}`);
  }

  const chunks: string[] = [];
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(new TextDecoder().decode(value));
    }
  } finally {
    reader.releaseLock();
  }

  await fs.writeFile(
    path.join(__dirname, "../test/mocks/promptql-response.json"),
    JSON.stringify(chunks, null, 2)
  );
}

captureResponse()
  .then(() => console.log("Response captured successfully"))
  .catch(console.error);
