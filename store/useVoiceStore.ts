import { Voice } from "@prisma/client";
import { create } from "zustand";

type VoiceStore = {
  voice: Voice | null;
  currentVoice: string;
  language: string;
  gender: string;
  role: string;
  voiceListRefreshed: number;
  voiceRefreshed: number;

  clickedVoice: Voice | null;
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  voice: null,
  currentVoice: "zh-CN-XiaoxiaoNeural",
  language: "zh-CN",
  gender: "All",
  role: "All",
  voiceListRefreshed: new Date().getTime(),
  voiceRefreshed: new Date().getTime(),

  clickedVoice: null,
}));
