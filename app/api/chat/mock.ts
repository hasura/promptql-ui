import fs from "fs";
import path from "path";

export function getMockResponse() {
  const faultyResponsePath = path.join(
    process.cwd(),
    "test/mocks/faulty-response.txt"
  );
  const faultyResponse = fs.readFileSync(faultyResponsePath, "utf-8");
  const lines = faultyResponse.split("\n");

  return new ReadableStream({
    async start(controller) {
      for (const line of lines) {
        if (!line.trim()) continue;
        controller.enqueue(new TextEncoder().encode(line + "\n"));
        await new Promise((resolve) => setTimeout(resolve, 50)); // Add delay to simulate streaming
      }
      controller.close();
    },
  });
}
