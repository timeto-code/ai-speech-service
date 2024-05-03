import logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ReadableOptions } from "stream";

function streamFile(
  path: string,
  options?: ReadableOptions
): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error)
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

function getContentTypeByExtension(ext: string) {
  const typeMap = {
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    // 添加其他音频类型
  } as Record<string, string>;
  return typeMap[ext] || "application/octet-stream";
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  logger.debug("GET /api/public/speech/chapter/[filename]");
  const { filename } = params;
  // 读取本地音频文件，返回给前端
  const filePath = path.resolve(
    process.cwd(),
    "public",
    "speech",
    "chapter",
    filename
  );

  try {
    const stats = await fs.promises.stat(filePath);
    const data: ReadableStream<Uint8Array> = streamFile(filePath);

    // 根据文件扩展名设置合适的 content-type
    const contentType = getContentTypeByExtension(path.extname(filename));

    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename=${path.basename(
          filePath
        )}`,
        "content-type": contentType,
        "content-length": stats.size.toString(),
        "accept-ranges": "bytes",
      }),
    });

    return res;
  } catch (error) {
    logger.error(`File not found: ${filePath}`);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
