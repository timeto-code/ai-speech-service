"use client";

import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import { Button } from "../ui/button";

const CancelButton = () => {
  const isPending = useTTS_SynthesisButton((state) => state.isPending);

  const handleClick = async () => {
    // TODO: cancel the synthesis
  };

  return (
    <Button className="h-full" variant="outline" disabled={!isPending} onClick={handleClick}>
      取消
    </Button>
  );
};

export default CancelButton;
