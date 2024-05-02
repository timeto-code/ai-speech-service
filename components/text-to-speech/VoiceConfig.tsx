"use client";

import { fetchRegionVoiceList } from "@/actions/TTS";
import { useVoiceStore } from "@/store/useVoiceStore";
import { useState } from "react";
import { Button } from "../ui/button";
import GenderCombobox from "./GenderCombobox";
import LanguageCombobox from "./LanguageCombobox";
import Spinner from "./Spinner";
import VoiceList from "./VoiceList";

const VoiceConfig = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="relative h-10">
        <Button
          variant="outline"
          className="w-full relative"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await fetchRegionVoiceList();
            useVoiceStore.setState({
              voiceListRefreshed: new Date().getTime(),
            });
            setIsLoading(false);
          }}
        >
          <span>更新声音列表</span>
        </Button>
        {isLoading && (
          <Spinner className="absolute top-3 left-[28%] h-4 w-4 animate-spin text-[#339900] mr-2" />
        )}
      </div>
      <LanguageCombobox isLoading={isLoading} />
      <GenderCombobox isLoading={isLoading} />
      <VoiceList />
    </div>
  );
};

export default VoiceConfig;
