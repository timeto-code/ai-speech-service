"use client";

import { fetchLanguageList, loadLanguageCodeMap } from "@/actions/TTS";
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
      const codeMap = await loadLanguageCodeMap();
      if (!codeMap) return;

      const res = await fetchLanguageList();

      const languageList = res.map((item) => ({
        label: codeMap[item],
        value: item,
      }));

      setLanguages(languageList);
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
