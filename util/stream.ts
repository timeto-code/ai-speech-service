import fs from "fs";
import { ReadableOptions } from "stream";

export const streamFile = (path: string, options?: ReadableOptions): ReadableStream<Uint8Array> => {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) => controller.error(error));
    },
    cancel() {
      downloadStream.destroy();
    },
  });
};

export const getContentTypeByExtension = (ext: string) => {
  const typeMap = {
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    // 添加其他音频类型
  } as Record<string, string>;
  return typeMap[ext] || "application/octet-stream";
};
