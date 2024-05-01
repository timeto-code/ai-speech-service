import { Voice } from "@prisma/client";
import { create } from "zustand";

type VoiceStore = {
  voice: Voice | null;
  currentVoice: string;
  language: string;
  gender: string;
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  voice: null,
  currentVoice: "zh-CN-XiaoxiaoNeural",
  language: "CN",
  gender: "All",
}));
