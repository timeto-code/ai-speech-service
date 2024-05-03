import { SsmlSection } from "@/store/useSSMLStore";

export const responseCodeMessageMap = {
  0: "success",
  1: "no valid sections found",
  2: "Speech synthesis started",
  3: "Internal Server Error",
  4: "语音合成器错误",
} as Record<string, string>;

export type ttsSynthesisReqDTO = {
  sectionPreview: boolean;
  sections: SsmlSection[];
};

export type ttsSynthesisResDTO = {
  code: number;
  message?: string;
  data?: string;
};
