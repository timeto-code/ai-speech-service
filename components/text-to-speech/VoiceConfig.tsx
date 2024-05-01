"use client";

import { fetchRegionVoiceList } from "@/actions/TTS";
import GenderCombobox from "../GenderCombobox";
import LanguageCombobox from "../LanguageCombobox";
import VoiceList from "../VoiceList";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import Spinner from "../Spinner";
import WCombobox from "../WCombobox";

const VoiceConfig = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex items-center">
        <span className="mr-2 w-10">语言</span>
        <div className="flex-1">
          <LanguageCombobox />
        </div>
      </div>
      {/* <div className="flex items-center">
        <span className="mr-2 w-10">语言</span>
        <div className="flex-1">
          <LanguageCombobox />
        </div>
      </div> */}
      <div className="flex items-center">
        <span className="mr-2 w-10">性别</span>
        <div className="flex-1">
          <GenderCombobox />
        </div>
      </div>
      <Separator className="my-1" />

      <div className="relative h-10">
        <Button
          variant="outline"
          className="w-full relative"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await fetchRegionVoiceList();
            setIsLoading(false);
          }}
        >
          <span>更新声音列表</span>
        </Button>
        {isLoading && (
          <Spinner className="absolute top-3 left-[28%] border-[2px] border-t-green-500/90 h-4 w-4 mr-2" />
        )}
      </div>
      <div className="overflow-auto pr-1">
        <VoiceList />
      </div>
    </div>
  );
};

export default VoiceConfig;
