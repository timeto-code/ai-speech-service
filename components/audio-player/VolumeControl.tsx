"use client";

import styles from "@/styles/VolumeControl.module.scss";
import React, { useState } from "react";
import {
  BiSolidVolume,
  BiSolidVolumeFull,
  BiSolidVolumeLow,
  BiSolidVolumeMute,
} from "react-icons/bi";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMute: () => void;
}

const VolumeControl = ({
  volume,
  isMuted,
  handleVolumeChange,
  handleMute,
}: VolumeControlProps) => {
  const VolumeIcon = () => {
    if (volume === 0) {
      return <BiSolidVolume size={18} className="w-5" />;
    } else if (volume <= 0.5 && volume !== 0) {
      return <BiSolidVolumeLow size={18} className="w-5" />;
    } else if (volume > 0.5) {
      return <BiSolidVolumeFull size={18} className="w-5" />;
    }
  };

  return (
    <div className="w-full flex items-center group">
      <button
        className="focus:outline-none outline-none ml-[2px]"
        onClick={() => {
          handleMute();
        }}
      >
        {isMuted ? (
          <BiSolidVolumeMute size={18} className=" w-5" />
        ) : (
          VolumeIcon()
        )}
      </button>
      <input
        type="range"
        // className={`w-24 hidden group-hover:block rotate-180 ${styles.slider}`}
        className={`w-16  ${styles.slider}`}
        style={{
          background: `linear-gradient(to right,  #fff ${(volume / 1) * 100}% 
        , #999999 ${(volume / 1) * 100}%)`,
        }}
        min={0}
        max={1}
        step={0.001}
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default VolumeControl;
