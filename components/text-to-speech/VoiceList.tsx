"use client";

import { fetchVoiceByfilter } from "@/actions/api/tts";
import { cn } from "@/lib/utils";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Voice } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import VoiceCard from "./VoiceCard";

const VoiceList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [voiceList, setVoiceList] = useState<Voice[]>([]);
  const language = useVoiceStore((state) => state.language);
  const gender = useVoiceStore((state) => state.gender);
  const voiceListRefreshed = useVoiceStore((state) => state.voiceListRefreshed);
  // 设置滚动条和内容的间隙
  const scrollDiv = useRef<HTMLDivElement>(null);
  const [isScrollBarVisible, setIsScrollBarVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchVoiceList = async () => {
      const res = await fetchVoiceByfilter(language, gender);
      if (res.code === 0 && res.data) {
        setVoiceList(res.data);
      } else {
        // 提示错误
      }
      setIsLoading(false);
    };

    fetchVoiceList();
  }, [language, gender, voiceListRefreshed]);

  useEffect(() => {
    if (!scrollDiv.current) return;
    setIsScrollBarVisible(scrollDiv.current.scrollHeight > scrollDiv.current.clientHeight);
  }, [scrollDiv.current]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center border rounded-sm">
        <Spinner className="h-10 w-10 animate-spin text-sky-500 " />
      </div>
    );
  }

  return (
    <div
      ref={scrollDiv}
      className={cn("h-full flex-1 overflow-auto", isScrollBarVisible ? "pr-1" : "")}
    >
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
