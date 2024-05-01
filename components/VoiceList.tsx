"use client";

import { getVoiceList } from "@/actions/TTS";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Voice } from "@prisma/client";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import VoiceCard from "./VoiceCard";

const VoiceList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const language = useVoiceStore((state) => state.language);
  const gender = useVoiceStore((state) => state.gender);
  const voiceListRefreshed = useVoiceStore((state) => state.voiceListRefreshed);

  useEffect(() => {
    setIsLoading(true);
    const fetchVoiceList = async () => {
      const res = await getVoiceList(language, gender);
      setVoiceList(res);
      setIsLoading(false);
    };

    fetchVoiceList();
  }, [language, gender, voiceListRefreshed]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center border rounded-sm">
        <Spinner className="h-10 w-10 animate-spin text-sky-500 " />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {voiceList.length > 0 ? (
        <div className="flex flex-col gap-2">
          {voiceList.map((voice, index) => (
            <VoiceCard key={index} voice={voice} />
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center border rounded-sm">
          <span className="text-muted-foreground">无可用声音</span>
          <span className="text-muted-foreground">请更新声音列表</span>
        </div>
      )}
    </div>
  );
};

export default VoiceList;
