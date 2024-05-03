import { SsmlSection } from "@/store/useSSMLStore";
import { Speech, Voice } from "@prisma/client";

export const responseCodeMessageMap = {
  0: "success",
  9: "failed",

  1: "no valid sections found",
  2: "Speech synthesis started",
  3: "Internal Server Error",

  4: "读取本地音频失败",

  5: "获取微软区域声音列表失败",

  6: "查询声音列表失败",

  7: "查询最新 TTS 音频失败",

  8: "查询语言列表失败",

  10: "获取语言选项列表值集合失败",
} as Record<string, string>;

// 通用响应 DTO
export type commonResDTO = {
  code: number;
  message?: string;
};

// TTS 合成 - 请求 DTO
export type ttsSynthesisReqDTO = {
  sectionPreview: boolean;
  sections: SsmlSection[];
};
// TTS 合成 - 响应 DTO
export type ttsSynthesisResDTO = {
  code: number;
  message?: string;
  data?: string;
};

// 读取本地音频 - 响应 DTO
export type getLocalAudioResDTO = {
  code: number;
  message?: string;
  data?: string;
};

// 获取微软区域声音列表 - 响应 DTO
export type fetchRegionVoiceListResDTO = {
  code: number;
  message?: string;
  data?: string;
};

// 查询声音列表 - 响应 DTO
export type fetchVoiceByfilterReqDTO = {
  code: number;
  message?: string;
  data?: Voice[];
};

// 查询最新 TTS 音频 - 响应 DTO
export type fetchLatestSpeechResDTO = {
  code: number;
  message?: string;
  data?: Speech | null;
};

// 查询语言列表 - 响应 DTO
export type fetchLanguageListResDTO = {
  code: number;
  message?: string;
  data?: string[];
};

// 获取语言选项列表值集合 - 响应 DTO
export type fetchLanguageOptionsResDTO = {
  code: number;
  message?: string;
  data?: OptionObject[];
};
