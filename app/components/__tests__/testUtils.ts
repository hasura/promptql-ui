import type { Chunk } from "../../accumulateChunks";

export function createChunkStream(chunks: Chunk[]) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 10));
        yield chunk;
      }
    },
  };
}

export async function collectStreamedChunks(
  stream: AsyncIterable<Chunk>
): Promise<Chunk[]> {
  const chunks: Chunk[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
}
