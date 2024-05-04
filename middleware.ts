import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ttsSynthesisStatusType } from "./util/state";

// SSE 状态
let status = "pending" as ttsSynthesisStatusType;

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl;

  /**
   * Nextjs 服务器无法使用 SSE 推送。
   * 借助 middleware 拦截功能，模拟服务器 SSE 推送。
   */
  if (nextUrl.pathname === "/api/tts/sse") {
    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    // 循环检查状态
    const interval = setInterval(() => {
      writer.write(encoder.encode(`data: ${status}\n\n`));

      if (status !== "pending") {
        clearInterval(interval);
        writer.close(); // 关闭流，释放资源
      }
    }, 500);

    return new Response(responseStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
    });
  }

  /**
   * 借助 middleware 拦截功能实现 status 状态的更新。
   */
  if (nextUrl.pathname.startsWith("/api/tts/sse/status/")) {
    status = nextUrl.pathname.replace("/api/tts/sse/status/", "") as ttsSynthesisStatusType;
    return NextResponse.json({ status });
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api.*)"],
};
