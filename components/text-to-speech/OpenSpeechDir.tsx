"use client";

import { openPath } from "@/actions/TTS";
import { Button } from "../ui/button";

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
