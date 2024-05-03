"use client";

import { speechSynthesis } from "@/lib/tts-synthesis";
import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import SoundSvg from "../SoundSvg";
import { Button } from "../ui/button";

const SpeechButton = () => {
  const isPending = useTTS_SynthesisButton((state) => state.isPending);

  const handleClick = async () => {
    speechSynthesis(false);
  };

  return (
    <Button className="h-11 w-[58px]" onClick={handleClick} variant="outline" disabled={isPending}>
      <SoundSvg animate={isPending} />
    </Button>
  );
};

export default SpeechButton;
