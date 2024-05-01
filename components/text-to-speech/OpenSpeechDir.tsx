"use client";

import React from "react";
import { Button } from "../ui/button";
import { openPath } from "@/actions/TTS";

const OpenSpeechDir = () => {
  return (
    <Button
      variant="outline"
      className="h-full select-none"
      onClick={() => {
        openPath();
      }}
      contentEditable={false}
    >
      打开文件
    </Button>
  );
};

export default OpenSpeechDir;
