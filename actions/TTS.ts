"use server";

import prisma from "@/lib/prisma";
import { getLatestSpeech } from "@/lib/speech";
import { Voice } from "@prisma/client";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { exec } from "child_process";
import logger from "@/lib/logger";

export const fetchRegionVoiceList = async () => {
  const voiceList = await axios.get(
    `https://${process.env.SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.SPEECH_KEY!,
      },
    }
  );

  const existVoices = await prisma.voice.findMany();
  // 更新声音列表
  const updatedVoices = [] as Voice[];
  // 新增声音列表
  const newVoices = [] as Voice[];

  voiceList.data.forEach((voice: any, index: number) => {
    if (
      voice.Locale.includes("CN") ||
      voice.Locale.includes("US") ||
      voice.Locale.includes("GB") ||
      voice.Locale.includes("JP") ||
      true
    ) {
      // 更具 ShortName 判断是否存在
      const existVoice = existVoices.find(
        (item) => item.ShortName === voice.ShortName
      );

      if (existVoice) {
        // 更新已存在的声音
        const prismaVoice = {
          ...existVoice,
          ...voice,
          SecondaryLocaleList: voice.SecondaryLocaleList
            ? JSON.stringify(voice.SecondaryLocaleList)
            : "",
          StyleList: voice.StyleList ? JSON.stringify(voice.StyleList) : "",
          RolePlayList: voice.RolePlayList
            ? JSON.stringify(voice.RolePlayList)
            : "",
        } as Voice;

        updatedVoices.push(prismaVoice);
      } else {
        const prismaVoice = {
          ...voice,
          SecondaryLocaleList: voice.SecondaryLocaleList
            ? JSON.stringify(voice.SecondaryLocaleList)
            : "",
          StyleList: voice.StyleList ? JSON.stringify(voice.StyleList) : "",
          RolePlayList: voice.RolePlayList
            ? JSON.stringify(voice.RolePlayList)
            : "",
          order: index,
        } as Voice;

        newVoices.push(prismaVoice);
      }
    }
  });

  // 更新已存在的声音
  updatedVoices.forEach(async (voice) => {
    await prisma.voice.update({
      where: {
        id: voice.id,
      },
      data: voice,
    });
  });
  // 新增声音
  await prisma.voice.createMany({
    data: newVoices,
  });

  const patss = process.cwd() + "/public/voiceList.json";
  await fs.writeFile(patss, JSON.stringify([...updatedVoices, ...newVoices]));
};

export const getVoiceList = async (language: string, gender: string) => {
  const where = {
    ...(language === "All" && gender === "All"
      ? {}
      : language === "All" && gender !== "All"
      ? {
          Gender: gender,
        }
      : language !== "All" && gender === "All"
      ? { Locale: { contains: language } }
      : { Locale: { contains: language }, Gender: gender }),
  };

  const voices = await prisma.voice.findMany({
    where,
  });

  // contains 条件为大小写不敏感，所以需要二次过滤
  const filteredVoices = voices.filter((voice) => {
    return voice.Locale.includes(language);
  });

  return filteredVoices;
};

export const fetchLocalAudios = async () => {
  const audioPath = process.cwd() + "/public/audio";
  const audoExtension = [".wav", ".mp3", ".ogg", ".flac"];
  const files = await fs.readdir(audioPath);

  const audioFiles = files.filter((file) => {
    return audoExtension.includes(path.extname(file));
  });

  // const audioNames = audioFiles.map((file) => {
  //   // return path.basename(file, path.extname(file)); // 不保留后缀
  //   return path.basename(file); // 保留后缀
  // });

  const sortedAudioNames = audioFiles
    .map((file) => {
      return {
        name: path.basename(file),
        timestamp: parseInt(file.split("-").slice(-1)[0]), // 提取时间戳
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp) // 根据时间戳降序排序
    .map((item) => item.name); // 获取排序后的文件名数组

  return sortedAudioNames;
};

export const fetchLatestSpeech = async () => {
  return await getLatestSpeech();
};

// 打开路径
export const openPath = async () => {
  const platform = os.platform();

  // 要打开的文件夹路径
  const dir = process.cwd() + "/public/speech";

  // 根据不同的操作系统执行不同的命令
  if (platform === "darwin") {
    // macOS
    exec(`open "${dir}"`);
  } else if (platform === "win32") {
    // Windows
    exec(`start "" "${dir}"`);
  } else if (platform === "linux") {
    // Linux
    exec(`xdg-open "${dir}"`);
  } else {
    console.error("Unsupported platform:", platform);
  }
};

export const fetchLanguageList = async () => {
  const voiceList = await prisma.voice.findMany({
    select: {
      Locale: true,
    },
    distinct: ["Locale"],
  });

  const languages = voiceList.map((item) => {
    const codeList = item.Locale.split("-");
    return codeList.length > 1 && codeList[1] ? codeList[1] : ""; // 返回 null 或其他默认值，而非 undefined
  });

  // 过滤掉空字符串
  const filteredLanguages = languages.filter((item) => item);

  // 删掉CN，HK，TW
  const removeList = ["CN", "HK", "TW"];
  const filteredLanguages2 = filteredLanguages.filter(
    (item) => !removeList.includes(item)
  );

  // 创建一个 Set 来去重，现在数组中不会有 undefined 或 null
  const languageSet = ["CN", "HK", "TW", ...new Set(filteredLanguages2)];

  const patss = process.cwd() + "/public/languageList.json";
  await fs.writeFile(patss, JSON.stringify([...languageSet]));

  return languageSet;
};
