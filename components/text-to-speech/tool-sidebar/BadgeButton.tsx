"use client";

import { cn } from "@/lib/utils";

interface Props {
  showEmoji?: boolean;
  titleMap: Record<string, { emoji: string; name: string }>;
  title: string;
  className?: string;
  handleClick: (style: string) => void;
}

const BadgeButton = ({ showEmoji, titleMap, title, className, handleClick }: Props) => {
  return (
    <button className={cn("border mt-1 mr-1 rounded-sm hover:bg-slate-400/50 transition-colors duration-200", className)} onClick={() => handleClick(title)}>
      {showEmoji && titleMap[title]?.emoji}
      <div className="whitespace-normal inline-block h-full pb-[2px] text-xs text-center align-middle">{titleMap[title]?.name || title}</div>
    </button>
  );
};

export default BadgeButton;
