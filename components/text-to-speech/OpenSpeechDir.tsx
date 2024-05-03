"use client";

import { openTTSAssetsDir } from "@/actions/api/os";
import { Button } from "../ui/button";

const OpenSpeechDir = () => {
  const handleClick = async () => {
    const res = await openTTSAssetsDir();
    if (res.code === 0) {
      // 提示成功
    } else {
      // 提示错误
    }
  };

  return (
    <Button
      variant="outline"
      className="h-full select-none"
      onClick={handleClick}
      contentEditable={false}
    >
      打开文件
    </Button>
  );
};

export default OpenSpeechDir;
