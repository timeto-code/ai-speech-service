import { getLocalAudioResDTO, responseCodeMessageMap } from "@/dto";
import { chapterDir } from "@/util/config";
import logger from "@/util/logger";
import { getContentTypeByExtension, streamFile } from "@/util/stream";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// 发送响应
const sendResponse = (res: getLocalAudioResDTO) => {
  res.message = responseCodeMessageMap[res.code];
  return NextResponse.json({ ...res }, { status: 200 });
};

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  const { filename } = params;
  // 读取本地音频文件，返回给前端
  const filePath = path.resolve(chapterDir, filename);

  try {
    const stats = await fs.promises.stat(filePath);
    const data: ReadableStream<Uint8Array> = streamFile(filePath);

    // 根据文件扩展名设置合适的 content-type
    const contentType = getContentTypeByExtension(path.extname(filename));

    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename=${path.basename(filePath)}`,
        "content-type": contentType,
        "content-length": stats.size.toString(),
        "accept-ranges": "bytes",
      }),
    });

    return res;
  } catch (error) {
    logger.error(`读取本地音频失败: ${filePath}`);
    // return sendResponse({ code: 4 });
    return NextResponse.json({ error: "读取本地音频失败" }, { status: 404 });
  }
}
