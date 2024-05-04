import { ttsSynthesisStatus } from "@/util/state";

export async function GET() {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // 循环检查状态
  const interval = setInterval(() => {
    const message = ttsSynthesisStatus.status;
    console.log("轮询", message);

    const isTerminated = ttsSynthesisStatus.isTerminated();
    if (isTerminated) {
      clearInterval(interval);
      writer.write(encoder.encode(`data: ${message}\n\n`));
      writer.close(); // 关闭流，释放资源
    }

    const isClosed = ttsSynthesisStatus.isClosed();
    if (isClosed) {
      clearInterval(interval);
      writer.write(encoder.encode(`data: ${message}\n\n`));
      writer.close(); // 关闭流，释放资源
    }
  }, 500);

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
