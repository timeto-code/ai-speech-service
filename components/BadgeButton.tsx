"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick: () => void;
  disabled?: boolean;
}

const BadgeButton = ({ children, handleClick, disabled }: Props) => {
  return (
    <button
      className={cn(
        "rounded-full pl-[1px] pr-[6px] bg-slate-300/50 m-[2px]",
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-zinc-300/90"
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default BadgeButton;
