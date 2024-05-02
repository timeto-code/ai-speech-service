import { create } from "zustand";

type AudioPlayer = {
  src: string | null;
};

export const useAudioPlayerStore = create<AudioPlayer>((set) => ({
  src: null,
}));
