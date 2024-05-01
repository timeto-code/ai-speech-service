"use client";

import { fetchRegionVoiceList } from "@/actions/TTS";
import { useState } from "react";
import GenderCombobox from "../GenderCombobox";
import LanguageCombobox from "../LanguageCombobox";
import Spinner from "../Spinner";
import VoiceList from "../VoiceList";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useVoiceStore } from "@/store/useVoiceStore";

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
      <div className="flex items-center">
        {/* <span className="mr-2 w-10">语言</span> */}
        <div className="flex-1 w-full">
          <LanguageCombobox isLoading={isLoading} />
        </div>
      </div>
      <div className="flex items-center">
        {/* <span className="mr-2 w-10">性别</span> */}
        <div className="flex-1 w-full">
          <GenderCombobox isLoading={isLoading} />
        </div>
      </div>
      {/* <Separator className="my-1" /> */}

      <div className="overflow-auto h-full">
        <VoiceList />
      </div>
    </div>
  );
};

export default VoiceConfig;
