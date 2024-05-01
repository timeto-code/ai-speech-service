"use client";

import { useMounted } from "@/hooks/useMounted";
import { useModalStore } from "@/store/useModalStore";
import React, { useEffect } from "react";

const VoiceModal = () => {
  const isMounted = useMounted();
  const voiceModal = useModalStore((state) => state.voiceModal);

  if (!isMounted) return null;

  return (
    <div
      className={`${
        voiceModal ? `absolute` : `hidden`
      } h-full w-full rounded-sm overflow-hidden bg-white z-50 border`}
    >
      <div className="h-full w-full">VoiceModal</div>
    </div>
  );
};

export default VoiceModal;
