"use client";

import React from "react";

interface Props {
  label: string;
  count?: number;
  handleClick: React.Dispatch<React.SetStateAction<boolean>>;
}

const Separator = ({ label, count, handleClick }: Props) => {
  return (
    <div>
      <button
        className="w-full h-6 text-sm flex items-center gap-2 px-1 rounded-[2px] hover:bg-zinc-300/50 transition-colors duration-200 ease-in-out"
        onClick={() => handleClick((prev) => !prev)}
      >
        <div className="border-b border-zinc-600/80 w-full" />

        <div className="flex flex-1 items-center justify-between gap-1">
          <span className="text-nowrap">{label}</span>
          <span className="text-xs">{count}</span>
        </div>
        <div className="border-b border-zinc-600/80 w-full" />
      </button>
    </div>
  );
};

export default Separator;
