import { create } from "zustand";

type ModalState = {
  voiceModal: boolean;
};

export const useModalStore = create<ModalState>((set) => ({
  voiceModal: true,
}));
