import { create } from "zustand";

type TTS_SynthesisButton = {
  status: EventSourceCode;
  setStatus: (status: EventSourceCode) => void;
};

export const useTTS_SynthesisButton = create<TTS_SynthesisButton>((set) => ({
  status: "finished",
  setStatus: (status) => set({ status }),
}));
