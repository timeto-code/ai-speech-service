"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Voice } from "@prisma/client";
import { useState } from "react";
import { useVoiceStore } from "@/store/useVoiceStore";
import { getVoiceList } from "@/actions/TTS";
import Loading from "./Loading";

const VoiceCombobox = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const language = useVoiceStore((state) => state.language);
  const gender = useVoiceStore((state) => state.gender);
  const [noVoice, setNoVoice] = useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const fetchVoiceList = async () => {
      const res = await getVoiceList();
      if (res.length === 0) {
        setNoVoice(true);
      }

      console.log("language", language);

      // 筛选出性别相同并且包含语言关键字的语音
      const filteredVoices = res.filter((voice) =>
        gender === "All"
          ? true
          : voice.Gender === gender && voice.Locale.includes(language)
      );

      console.log("filteredVoices.length", filteredVoices.length);

      setVoices(filteredVoices);
      setIsLoading(false);
      setNoVoice(false);
    };

    fetchVoiceList();
  }, [language, gender]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? voices.find((voice) => voice.ShortName === value)?.LocalName
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 ">
        <Command className="p-1 flex gap-1 h-[200px] overflow-auto">
          {/* <CommandInput placeholder="Search framework..." /> */}
          {/* <CommandEmpty>No framework found.</CommandEmpty> */}
          {/* <CommandGroup> */}
          {/* <CommandItem
              value={"Next.js"}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === "Next.js" ? "opacity-100" : "opacity-0"
                )}
              />
              xxxx
            </CommandItem> */}

          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <Loading />
            </div>
          )}

          {noVoice && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">暂无语音</span>
            </div>
          )}

          {voices.map((voice, i) => (
            <button
              className="w-full hover:bg-zinc-300/50 rounded-sm h-8 flex items-center px-2"
              key={i}
              value={voice.ShortName}
              onClick={() => {
                setValue(voice.ShortName);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === voice.ShortName ? "opacity-100" : "opacity-0"
                )}
              />
              <span className="text-sm">{voice.LocalName}</span>
            </button>
          ))}
          {/* </CommandGroup> */}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VoiceCombobox;
