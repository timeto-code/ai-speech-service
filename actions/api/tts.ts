"use server";

import { getLatestSpeech } from "@/actions/prisma/speech";
import {
  fetchLanguageListResDTO,
  fetchLanguageOptionsResDTO,
  fetchLatestSpeechResDTO,
  fetchRegionVoiceListResDTO,
  fetchRoleOptionsResDTO,
  fetchVoiceByfilterReqDTO,
  responseCodeMessageMap,
} from "@/dto";
import { rootDir } from "@/util/config";
import logger from "@/util/logger";
import prisma from "@/util/prisma";
import { Voice } from "@prisma/client";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { getVoiceByfilter } from "../prisma/voice";

const sendResponse = (
  res:
    | fetchRegionVoiceListResDTO
    | fetchVoiceByfilterReqDTO
    | fetchLatestSpeechResDTO
    | fetchLanguageListResDTO
    | fetchLanguageOptionsResDTO
    | fetchRoleOptionsResDTO
) => {
  res.message = responseCodeMessageMap[res.code];
  return { ...res };
};

// 获取微软区域声音列表
export const fetchRegionVoiceList = async () => {
  try {
    const regionVoices = await axios.get(process.env.REGION_VOICE_LIST_API!, {
      headers: { "Ocp-Apim-Subscription-Key": process.env.SPEECH_KEY! },
    });

    const existingVoices = [] as Voice[];
    const newVoices = [] as Voice[];
    const voices = await prisma.voice.findMany();

    regionVoices.data.forEach((voice: any, index: number) => {
      const existed = voices.find((item) => item.ShortName === voice.ShortName);
      if (existed) {
        // 更新声音
        const prismaVoice = {
          ...existed,
          ...voice,
          SecondaryLocaleList: voice.SecondaryLocaleList
            ? JSON.stringify(voice.SecondaryLocaleList)
            : "",
          StyleList: voice.StyleList ? JSON.stringify(voice.StyleList) : "",
          RolePlayList: voice.RolePlayList ? JSON.stringify(voice.RolePlayList) : "",
        } as Voice;

        existingVoices.push(prismaVoice);
      } else {
        // 新增声音
        const prismaVoice = {
          ...voice,
          SecondaryLocaleList: voice.SecondaryLocaleList
            ? JSON.stringify(voice.SecondaryLocaleList)
            : "",
          StyleList: voice.StyleList ? JSON.stringify(voice.StyleList) : "",
          RolePlayList: voice.RolePlayList ? JSON.stringify(voice.RolePlayList) : "",
          order: index,
        } as Voice;

        newVoices.push(prismaVoice);
      }
    });

    // 更新
    existingVoices.forEach(async (voice) => {
      await prisma.voice.update({
        where: {
          id: voice.id,
        },
        data: voice,
      });
    });
    // 新建
    await prisma.voice.createMany({
      data: newVoices,
    });

    const filePath = path.join(rootDir, "public", "voiceList.json");
    await fs.writeFile(filePath, JSON.stringify([...existingVoices, ...newVoices]));

    return sendResponse({ code: 0 }) as fetchRegionVoiceListResDTO;
  } catch (error) {
    logger.error(`${responseCodeMessageMap[5]}: ${error}`);
    return sendResponse({ code: 5 }) as fetchRegionVoiceListResDTO;
  }
};

// 查询声音列表
export const fetchVoiceByfilter = async (language: string, gender: string, role: string) => {
  try {
    const res = await getVoiceByfilter(language, gender, role);
    return sendResponse({ code: 0, data: res }) as fetchVoiceByfilterReqDTO;
  } catch (error) {
    logger.error(`${responseCodeMessageMap[6]}: ${error}`);
    return sendResponse({ code: 6 }) as fetchVoiceByfilterReqDTO;
  }
};

// 查询最新 TTS 音频
export const fetchLatestSpeech = async () => {
  try {
    const speech = await getLatestSpeech();
    return sendResponse({ code: 0, data: speech }) as fetchLatestSpeechResDTO;
  } catch (error) {
    logger.error(`${responseCodeMessageMap[7]}: ${error}`);
    return sendResponse({ code: 7 }) as fetchLatestSpeechResDTO;
  }
};

// 查询语言列表
export const fetchLanguageList = async () => {
  try {
    const voiceList = await prisma.voice.findMany({
      select: { Locale: true },
    });

    // 已知汉语声音列表
    const primaryLanguages = [
      "zh-CN",
      "zh-CN-guangxi",
      "zh-CN-henan",
      "zh-CN-liaoning",
      "zh-CN-shaanxi",
      "zh-CN-shandong",
      "zh-CN-sichuan",
      "wuu-CN",
      "yue-CN",
      "zh-HK",
      "zh-TW",
      "en-HK",
    ];

    // 创建一个 Set 来存储语言列表并去重
    const languageSet = new Set(primaryLanguages);

    // 检查已知语言列表是否存在于数据库中，不存在则添加
    voiceList.forEach((item) => {
      if (primaryLanguages.includes(item.Locale)) {
        languageSet.add(item.Locale);
      }
    });

    // 写入语言列表到 JSON 文件
    voiceList.forEach((item) => {
      if (!primaryLanguages.includes(item.Locale)) {
        languageSet.add(item.Locale);
      }
    });

    // 写入语言列表到 JSON 文件
    const filePath = path.join(rootDir, "public", "languageList.json");
    await fs.writeFile(filePath, JSON.stringify([...languageSet], null, 2));

    return sendResponse({ code: 0, data: [...languageSet] }) as fetchLanguageListResDTO;
  } catch (error) {
    logger.error(`${responseCodeMessageMap[8]}: ${error}`);
    return sendResponse({ code: 8 }) as fetchLanguageListResDTO;
  }
};

// 获取语言选项列表值集合
export const fetchLanguageOptions = async (languages: string[]) => {
  try {
    const filePath = path.join(rootDir, "public", "LanguageCode.json");
    const languagesStr = await fs.readFile(filePath, "utf-8");
    const languagesObj = JSON.parse(languagesStr);

    const options = languages.map((item) => ({
      label: languagesObj[item],
      value: item,
    })) as OptionObject[];

    return sendResponse({ code: 0, data: options }) as fetchLanguageOptionsResDTO;
  } catch (error) {
    logger.error(`${responseCodeMessageMap[10]}: ${error}`);
    return sendResponse({ code: 10 }) as fetchLanguageOptionsResDTO;
  }
};

// 获取语言角色列表值集合
export const fetchRoleList = async () => {
  try {
    const voices = await prisma.voice.findMany({
      select: { RolePlayList: true },
    });

    const roleSet = new Set<string>();
    voices.forEach((v) => {
      if (v.RolePlayList) {
        JSON.parse(v.RolePlayList).forEach((role: string) => {
          roleSet.add(role);
        });
      }
    });

    const writeFilePath = path.join(rootDir, "public", "role.json");
    fs.writeFile(writeFilePath, JSON.stringify([...roleSet], null, 2));

    const readFilePath = path.join(rootDir, "public", "RoleCode.json");
    const roleCodeStr = await fs.readFile(readFilePath, "utf-8");
    const roleCodeObj = JSON.parse(roleCodeStr);

    const options = Array.from(roleSet).map((item) => ({
      label: roleCodeObj[item] || item,
      value: item,
    })) as OptionObject[];

    // 第一位加入 All 选项
    options.unshift({ label: "全部", value: "All" });

    return sendResponse({ code: 0, data: options }) as fetchRoleOptionsResDTO;
  } catch (error) {
    logger.error(`${responseCodeMessageMap[12]}: ${error}`);
    return sendResponse({ code: 12 }) as fetchRoleOptionsResDTO;
  }
};
