"use client";

import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import axios from "axios";
import { Button } from "../ui/button";

const CancelButton = () => {
  const isPending = useTTS_SynthesisButton((state) => state.isPending);

  const handleClick = async () => {
    const res = await axios.get("/api/tts?action=CancelSynthesis");
    if (res.status === 200 && res.data.code === 2) {
      console.log("取消语音合成成功");
    } else {
      console.error("取消语音合成失败");
    }
  };

  return (
    <Button className="h-full" variant="outline" disabled={!isPending} onClick={handleClick}>
      取消
    </Button>
  );
};

export default CancelButton;
