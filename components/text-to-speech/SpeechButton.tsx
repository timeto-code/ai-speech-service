"use client";

import { speechSynthesis } from "@/lib/tts-synthesis";
import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import SoundSvg from "../SoundSvg";
import { Button } from "../ui/button";

const SpeechButton = () => {
  const status = useTTS_SynthesisButton((state) => state.status);

  const handleClick = async () => {
    speechSynthesis(false);
  };

  return (
    <Button
      className="h-11 w-[58px]"
      onClick={handleClick}
      variant="outline"
      disabled={status === "pending"}
    >
      <SoundSvg animate={status === "pending"} />
    </Button>
  );
};

export default SpeechButton;
