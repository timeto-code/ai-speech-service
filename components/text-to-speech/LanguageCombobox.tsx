"use client";

import { fetchLanguageList, fetchLanguageOptions } from "@/actions/api/tts";
import { useVoiceStore } from "@/store/useVoiceStore";
import { useEffect, useState } from "react";
import Combobox from "../Combobox";

interface Props {
  isLoading: boolean;
}

const LanguageCombobox = ({ isLoading }: Props) => {
  const [value, setValue] = useState<string>("zh-CN");
  const [languages, setLanguages] = useState<OptionObject[]>([]);

  const voiceListRefreshed = useVoiceStore((state) => state.voiceListRefreshed);

  useEffect(() => {
    const fetchLanguage = async () => {
      const resLang = await fetchLanguageList();
      if (resLang.code === 0 && resLang.data) {
        const resOptions = await fetchLanguageOptions(resLang.data);
        if (resOptions.code === 0 && resOptions.data) {
          setLanguages(resOptions.data);
        } else {
          // 提示错误
        }
      } else {
        // 提示错误
      }
    };

    fetchLanguage();
  }, [voiceListRefreshed]);

  useEffect(() => {
    useVoiceStore.setState({ language: value });
  }, [value]);

  return (
    <Combobox
      boxLabel="语言"
      options={languages}
      value={value}
      setValue={setValue}
      isLoading={isLoading}
      className="h-[calc(100vh-116px)] w-[288px] py-1 px-0"
    />
  );
};

export default LanguageCombobox;
