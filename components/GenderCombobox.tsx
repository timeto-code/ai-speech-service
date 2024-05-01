"use client";

import { useVoiceStore } from "@/store/useVoiceStore";
import React, { useEffect } from "react";
import Combobox from "./Combobox";

const languages = [
  { label: "全部", value: "All" },
  { label: "男", value: "Male" },
  { label: "女", value: "Female" },
];

interface Props {
  isLoading: boolean;
}

const GenderCombobox = ({ isLoading }: Props) => {
  const [value, setValue] = React.useState<string>("All");

  useEffect(() => {
    useVoiceStore.setState({ gender: value });
  }, [value]);

  return (
    <Combobox
      boxLabel="性别"
      options={languages}
      value={value}
      setValue={setValue}
      isLoading={isLoading}
      className="h-[114px] w-[288px] py-1 px-0"
    />
  );
};

export default GenderCombobox;
