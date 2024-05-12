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
  divEeditor: string | null;
};

export const useSSMLStore = create<SSMLStore>((set) => ({
  currentVoceSection: { id: 0, voice: null, htmlContent: "" },
  divEeditor: null,
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

export type XMLNode = {
  id: string;
  node: string;
};

type SSMLNodeStore = {
  nodes: XMLNode[];
  clearNodes: () => void;
  phoneme: XMLNode[];
  break: XMLNode[];
  mstts_express_as: XMLNode[];
  addPhoneme: (phoneme: XMLNode) => void;
  addBreak: (breakTime: XMLNode) => void;
  addMsttsExpressAs: (expressAs: XMLNode) => void;
  deletePhoneme: (index: string) => void;
  deleteBreak: (index: string) => void;
  deleteMsttsExpressAs: (index: string) => void;
  clearPhoneme: () => void;
  clearBreak: () => void;
  clearMsttsExpressAs: () => void;
};

export const useSSMLNodeStore = create<SSMLNodeStore>((set) => ({
  nodes: [],
  clearNodes: () => set({ nodes: [] }),

  phoneme: [],
  addPhoneme: (phoneme) => {
    set((state) => ({ phoneme: [...state.phoneme, phoneme], nodes: [...state.nodes, phoneme] }));
  },
  deletePhoneme: (index) => {
    set((state) => ({
      phoneme: state.phoneme.filter((p) => p.id !== index),
      nodes: state.nodes.filter((n) => n.id !== index),
    }));
  },
  clearPhoneme: () => set({ phoneme: [] }),

  break: [],
  addBreak: (breakTime) => {
    set((state) => ({ break: [...state.break, breakTime], nodes: [...state.nodes, breakTime] }));
  },
  deleteBreak: (index) => {
    set((state) => ({
      break: state.break.filter((b) => b.id !== index),
      nodes: state.nodes.filter((n) => n.id !== index),
    }));
  },
  clearBreak: () => set({ break: [] }),

  mstts_express_as: [],
  addMsttsExpressAs: (expressAs) => {
    set((state) => ({
      mstts_express_as: [...state.mstts_express_as, expressAs],
      nodes: [...state.nodes, expressAs],
    }));
  },
  deleteMsttsExpressAs: (index) => {
    set((state) => ({
      mstts_express_as: state.mstts_express_as.filter((e) => e.id !== index),
      nodes: state.nodes.filter((n) => n.id !== index),
    }));
  },
  clearMsttsExpressAs: () => set({ mstts_express_as: [] }),
}));
