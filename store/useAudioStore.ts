import { create } from "zustand";

type AudioStore = {
  audioList: string[];
  currentPlayingAudio: string | null;
};

export const useAudioStore = create<AudioStore>((set) => ({
  audioList: [],
  currentPlayingAudio: null,
}));
