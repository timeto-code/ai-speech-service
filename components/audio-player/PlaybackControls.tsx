"use client";

import { useMounted } from "@/hooks/useMounted";
import { useRef } from "react";
import {
  IoIosFastforward,
  IoIosPause,
  IoIosPlayCircle,
  IoIosRewind,
} from "react-icons/io";

interface PlaybackControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  handleForward: () => void;
  handleBackward: () => void;
}

const PlaybackControls = ({
  isPlaying,
  togglePlayPause,
  handleForward,
  handleBackward,
}: PlaybackControlsProps) => {
  const isMounted = useMounted();
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button onClick={handleBackward}>
        <IoIosRewind size={28} />
      </button>
      <button ref={buttonRef} className="mx-3" onClick={togglePlayPause}>
        {isPlaying ? <IoIosPause size={24} /> : <IoIosPlayCircle size={24} />}
      </button>
      <button onClick={handleForward}>
        <IoIosFastforward size={28} />
      </button>
    </>
  );
};

export default PlaybackControls;
