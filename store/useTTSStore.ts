import { ttsSynthesisStatusType } from "@/lib/state";
import { create } from "zustand";

type TTS_SynthesisButton = {
  status: ttsSynthesisStatusType;
  isPending: boolean;
  isCanceled: boolean;
  setStatus: (status: ttsSynthesisStatusType) => void;
  setStatusPending: () => void;
  setStatusFinished: () => void;
  setStatusCanceled: () => void;
  setStatusError: () => void;
};

export const useTTS_SynthesisButton = create<TTS_SynthesisButton>((set) => ({
  status: "finished",
  isPending: false,
  isCanceled: false,
  setStatus(status) {
    set({ status, isPending: status === "pending" });
  },
  setStatusPending() {
    set({ status: "pending", isPending: true, isCanceled: false });
  },
  setStatusFinished() {
    set({ status: "finished", isPending: false, isCanceled: false });
  },
  setStatusCanceled() {
    set({ status: "canceled", isPending: false, isCanceled: true });
  },
  setStatusError() {
    set({ status: "error", isPending: false, isCanceled: false });
  },
}));
