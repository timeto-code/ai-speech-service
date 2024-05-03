import { ttsSynthesisStatusType } from "@/lib/state";
import { create } from "zustand";

type TTS_SynthesisButton = {
  status: ttsSynthesisStatusType;
  setStatus: (status: ttsSynthesisStatusType) => void;
  setStatusPending: () => void;
  setStatusFinished: () => void;
  setStatusCanceled: () => void;
  setStatusError: () => void;
  isPending: boolean;
};

export const useTTS_SynthesisButton = create<TTS_SynthesisButton>((set) => ({
  status: "finished",
  setStatus(status) {
    set({ status, isPending: status === "pending" });
  },
  setStatusPending() {
    set({ status: "pending", isPending: true });
  },
  setStatusFinished() {
    set({ status: "finished", isPending: false });
  },
  setStatusCanceled() {
    set({ status: "canceled", isPending: false });
  },
  setStatusError() {
    set({ status: "error", isPending: false });
  },
  isPending: false,
}));
