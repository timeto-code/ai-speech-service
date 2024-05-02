import { Voice } from "@prisma/client";
import { create } from "zustand";

export type SsmlSection = {
  id: number;
  voice: Voice | null;
  htmlContent?: string;
  url?: string;
};

type SSMLStore = {
  currentVoceSection: SsmlSection;
};

export const useSSMLStore = create<SSMLStore>((set) => ({
  currentVoceSection: { id: 0, voice: null, htmlContent: "" },
}));

type SsmlSectionsStore = {
  sections: SsmlSection[];
};

export const useSsmlSectionsStore = create<SsmlSectionsStore>((set) => ({
  sections: [],
}));

type SsmlSynthesisStore = {
  started: number;
  setStarted: () => void;
};

export const useSsmlSynthesisStore = create<SsmlSynthesisStore>((set) => ({
  started: new Date().getTime(),
  setStarted: () => {
    set({ started: new Date().getTime() });
  },
}));
