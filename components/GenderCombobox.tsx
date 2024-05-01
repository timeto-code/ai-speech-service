"use client";

import { useVoiceStore } from "@/store/useVoiceStore";
import React, { useEffect } from "react";
import Combobox from "./Combobox";

const languages = [
  { label: "全部", value: "All" },
  { label: "男", value: "Male" },
  { label: "女", value: "Female" },
];

const GenderCombobox = () => {
  const [value, setValue] = React.useState<string>("All");

  useEffect(() => {
    useVoiceStore.setState({ gender: value });
  }, [value]);

  return (
    <Combobox
      options={languages}
      value={value}
      setValue={setValue}
      className="h-[114px] w-[240px] py-1 px-0"
    />
  );
};

export default GenderCombobox;
