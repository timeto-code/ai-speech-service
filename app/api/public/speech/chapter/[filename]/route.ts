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
    await fs.promises.access(filePath);
  } catch (error) {
    logger.error(`File not found: ${filePath}`);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const data: ReadableStream<Uint8Array> = streamFile(filePath);

  const res = new NextResponse(data, {
    status: 200,
    headers: new Headers({
      "content-disposition": `attachment; filename=${path.basename(filePath)}`,
      "content-type": "application/iso",
      // "content-length": stats.size + "",
    }),
  });

  return res;
}
