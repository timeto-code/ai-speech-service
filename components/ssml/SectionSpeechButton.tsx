"use client";

import React from "react";
import SectionSoundSvg from "../SectionSoundSvg";

interface Props {
  label?: string;
  handleSynthesis: () => void;
  code?: string;
}

const SectionSpeechButton = ({ label, handleSynthesis, code }: Props) => {
  return (
    <button
      className="h-8 w-8 p-1"
      onClick={handleSynthesis}
      disabled={code === "pending"}
      contentEditable={false}
    >
      <SectionSoundSvg animate={code === "pending"} />
    </button>
  );
};

export default SectionSpeechButton;
