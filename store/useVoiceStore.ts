import { Voice } from "@prisma/client";
import { create } from "zustand";

type VoiceStore = {
  voice: Voice | null;
  currentVoice: string;
  language: string;
  gender: string;
  voiceListRefreshed: number;
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  voice: null,
  currentVoice: "zh-CN-XiaoxiaoNeural",
  language: "zh-CN",
  gender: "All",
  voiceListRefreshed: new Date().getTime(),
}));
