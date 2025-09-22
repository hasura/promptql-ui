export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        const message = `data: {"message": "Test chunk ${count}", "timestamp": "${new Date().toISOString()}"}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
        
        if (count >= 3) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}