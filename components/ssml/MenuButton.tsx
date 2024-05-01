"use client";

import { cn } from "@/lib/utils";
import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Button } from "../ui/button";

interface Props {
  label: string;
  onClick: () => void;
  className?: string;
}

const MenuButton = ({ label, onClick, className }: Props) => {
  const status = useTTS_SynthesisButton((state) => state.status);
  const language = useVoiceStore((state) => state.language);

  if (label === "声调" && language !== "CN") {
    return null;
  }

  return (
    <Button
      className={cn("py-0 px-1 h-6 select-none", className)}
      variant="outline"
      onClick={onClick}
      disabled={status === "pending"}
      contentEditable={false}
    >
      <span className="text-sm">{label}</span>
    </Button>
  );
};

export default MenuButton;
