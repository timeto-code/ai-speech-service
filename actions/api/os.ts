"use server";

import { commonResDTO, responseCodeMessageMap } from "@/dto";
import { rootDir } from "@/util/config";
import logger from "@/util/logger";
import { exec as execCb } from "child_process";
import os from "os";
import { promisify } from "util";

const exec = promisify(execCb);

const sendResponse = (res: commonResDTO) => {
  res.message = responseCodeMessageMap[res.code];
  return { ...res };
};

// 打开 TTS 资源目录
export const openTTSAssetsDir = async () => {
  const platform = os.platform();
  const dir = `${rootDir}/public/speech`;

  try {
    // 根据不同的操作系统执行不同的命令
    switch (platform) {
      case "darwin":
        // macOS
        await exec(`open "${dir}"`);
        break;
      case "win32":
        // Windows
        await exec(`start "" "${dir}"`);
        break;
      case "linux":
        // Linux
        await exec(`xdg-open "${dir}"`);
        break;
      default:
        console.error("Unsupported platform:", platform);
    }

    return sendResponse({ code: 0 });
  } catch (error) {
    logger.error(`打开 TTS 资源目录失败: ${error}`);
    return sendResponse({ code: 9 });
  }
};
