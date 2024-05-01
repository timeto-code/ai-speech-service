"use client";

import { fetchRegionVoiceList, getVoiceList } from "@/actions/TTS";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Voice } from "@prisma/client";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import VoiceCard from "./VoiceCard";
import { Button } from "./ui/button";

const VoiceList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const language = useVoiceStore((state) => state.language);
  const gender = useVoiceStore((state) => state.gender);

  useEffect(() => {
    setIsLoading(true);
    const fetchVoiceList = async () => {
      const res = await getVoiceList(language, gender);
      setVoiceList(res);
      setIsLoading(false);
    };

    fetchVoiceList();
  }, [language, gender]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
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
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">暂无语音</span>
          <Button
            onClick={async () => {
              await fetchRegionVoiceList();
            }}
          >
            获取语言
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceList;
