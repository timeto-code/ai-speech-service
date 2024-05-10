"use client";

import { fetchRegionVoiceList } from "@/actions/api/tts";
import { useVoiceStore } from "@/store/useVoiceStore";
import { useState } from "react";
import { Button } from "../ui/button";
import GenderCombobox from "./GenderCombobox";
import LanguageCombobox from "./LanguageCombobox";
import Spinner from "./Spinner";
import VoiceList from "./VoiceList";
import CardList from "./CardList";

const Voices = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const res = await fetchRegionVoiceList();
    if (res.code === 0) {
      useVoiceStore.setState({
        voiceListRefreshed: new Date().getTime(),
      });
    } else {
      // 提示错误
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="relative h-10">
        <Button
          variant="outline"
          className="w-full relative"
          disabled={isLoading}
          onClick={handleClick}
        >
          <span>更新声音列表</span>
        </Button>
        {isLoading && (
          <Spinner className="absolute top-3 left-[28%] h-4 w-4 animate-spin text-[#339900] mr-2" />
        )}
      </div>
      <div className="h-10">
        <LanguageCombobox isLoading={isLoading} />
      </div>
      <div className="h-10">
        <GenderCombobox isLoading={isLoading} />
      </div>
      <div className="h-10">
        <GenderCombobox isLoading={isLoading} />
      </div>
      <div className="h-10">
        <GenderCombobox isLoading={isLoading} />
      </div>
      <CardList />
    </div>
  );
};

export default Voices;
