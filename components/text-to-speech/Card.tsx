"use client";

import { Voice } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Ellipsis } from "lucide-react";
import BadgeButton from "../BadgeButton";
import { cn } from "@/lib/utils";

export const StylesEmoji: Record<string, { emoji: string; name: string }> = {
  angrychat: {
    emoji: "😡",
    name: "生气",
  },
  cheerful: {
    emoji: "😄",
    name: "欢快",
  },
  customerservice: {
    emoji: "👩‍💼",
    name: "客户服务",
  },
  empathetic: {
    emoji: "🤝",
    name: "有同理心的",
  },
  excited: {
    emoji: "🤩",
    name: "兴奋的",
  },
  friendly: {
    emoji: "👫",
    name: "友好的",
  },
  hopeful: {
    emoji: "🌈",
    name: "充满希望的",
  },
  "narration-professional": {
    emoji: "🎙️",
    name: "专业解说",
  },
  "newscast-casual": {
    emoji: "📰",
    name: "随意新闻播报",
  },
  "newscast-formal": {
    emoji: "📰",
    name: "正式新闻播报",
  },
  sad: {
    emoji: "😢",
    name: "悲伤的",
  },
  shouting: {
    emoji: "🗣️",
    name: "大喊",
  },
  terrified: {
    emoji: "😱",
    name: "恐惧的",
  },
  unfriendlywhispering: {
    emoji: "🤫",
    name: "不友好的耳语",
  },
  angry: {
    emoji: "😡",
    name: "生气",
  },
  chat: {
    emoji: "💬",
    name: "聊天",
  },
  unfriendly: {
    emoji: "😠",
    name: "不友好的",
  },
  whispering: {
    emoji: "🤫",
    name: "耳语",
  },
  newscast: {
    emoji: "📰",
    name: "新闻播报",
  },
  assistant: {
    emoji: "🤖",
    name: "助手",
  },
  calm: {
    emoji: "😌",
    name: "平静的",
  },
  affectionate: {
    emoji: "🥰",
    name: "充满爱心的",
  },
  disgruntled: {
    emoji: "😤",
    name: "不满的",
  },
  embarrassed: {
    emoji: "😳",
    name: "尴尬的",
  },
  fearful: {
    emoji: "😨",
    name: "害怕的",
  },
  gentle: {
    emoji: "🌸",
    name: "温柔的",
  },
  serious: {
    emoji: "😐",
    name: "严肃的",
  },
  depressed: {
    emoji: "😔",
    name: "抑郁的",
  },
  envious: {
    emoji: "😒",
    name: "嫉妒的",
  },
  "chat-casual": {
    emoji: "💬",
    name: "随意聊天",
  },
  lyrical: {
    emoji: "🎶",
    name: "抒情的",
  },
  "poetry-reading": {
    emoji: "📖",
    name: "朗诵诗歌",
  },
  sorry: {
    emoji: "😞",
    name: "遗憾的",
  },
  whisper: {
    emoji: "🤫",
    name: "耳语",
  },
  "advertisement-upbeat": {
    emoji: "📺",
    name: "活泼的广告",
  },
  "documentary-narration": {
    emoji: "🎥",
    name: "纪录片解说",
  },
  "narration-relaxed": {
    emoji: "🎙️",
    name: "轻松解说",
  },
  "sports-commentary": {
    emoji: "🏈",
    name: "体育评论",
  },
  "sports-commentary-excited": {
    emoji: "🏈",
    name: "兴奋的体育评论",
  },
  livecommercial: {
    emoji: "📺",
    name: "现场广告",
  },
};

// Boy - 男孩
// Girl - 女孩
// OlderAdultFemale - 成年女性
// OlderAdultMale - 成年男性
// SeniorFemale - 老年女性
// SeniorMale - 老年男性
// YoungAdultFemale - 青年女性
// YoungAdultMale - 青年男性
// Narrator - 叙述者

export const rolePlayEmoji: Record<string, { emoji: string; name: string }> = {
  Boy: {
    emoji: "👦",
    name: "男孩",
  },
  Girl: {
    emoji: "👧",
    name: "女孩",
  },
  OlderAdultFemale: {
    emoji: "👩",
    name: "成年女性",
  },
  OlderAdultMale: {
    emoji: "👨",
    name: "成年男性",
  },
  SeniorFemale: {
    emoji: "👵",
    name: "老年女性",
  },
  SeniorMale: {
    emoji: "👴",
    name: "老年男性",
  },
  YoungAdultFemale: {
    emoji: "👩",
    name: "青年女性",
  },
  YoungAdultMale: {
    emoji: "👨",
    name: "青年男性",
  },
  Narrator: {
    emoji: "🎙️",
    name: "叙述者",
  },
};

interface Props {
  voice: Voice;
  isDetailSidebar?: boolean;
}

const Card = ({ voice, isDetailSidebar }: Props) => {
  const [showDetail, setShowDetail] = useState(isDetailSidebar);

  const handleClick = () => {
    // 详情页面
    if (isDetailSidebar) return;

    console.log("voice", voice);
    useVoiceStore.setState({ voice: voice });
    useVoiceStore.setState({
      voiceRefreshed: new Date().getTime(),
    });
    useVoiceStore.setState({ currentVoice: voice.ShortName });
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "border border-zinc-400/50 p-1 rounded-sm h-auto w-full",
        isDetailSidebar ? "hover:bg-white cursor-default" : "hover:bg-zinc-300/50"
      )}
      onClick={handleClick}
    >
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-full flex gap-2 items-center">
          <div className="rounded-full h-12 w-12 relative">
            <Image
              src={voice.Gender === "Male" ? "/image/man.png" : "/image/woman.png"}
              alt=""
              fill
              sizes="48"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col flex-1 w-full gap-1">
            <div className="flex justify-between items-center">
              <div className="w-full flex items-start">{voice.LocalName}</div>

              {voice.StyleList || voice.RolePlayList || voice.SecondaryLocaleList ? (
                <button
                  className="flex items-center justify-center group hover:bg-zinc-300/50 px-1 rounded-md transition-colors duration-200 ease-in-out"
                  onClick={(e) => {
                    // if (isDetailSidebar) return;

                    e.preventDefault();
                    e.stopPropagation();
                    setShowDetail(!showDetail);
                  }}
                >
                  <Ellipsis className="h-4 w-4 cursor-pointer group-hover:text-sky-500" />
                </button>
              ) : null}
            </div>
            <div className="text-sm text-gray-400 flex h-5 justify-between">
              {voice.StyleList && JSON.parse(voice.StyleList).length > 0 && (
                <div className=" flex items-center justify-center  ">
                  {JSON.parse(voice.StyleList).length} 种语气
                </div>
              )}
              {voice.RolePlayList && JSON.parse(voice.RolePlayList).length > 0 && (
                <div className=" flex items-center justify-center mr-1">
                  {JSON.parse(voice.RolePlayList).length} 个角色
                </div>
              )}
              {voice.SecondaryLocaleList && JSON.parse(voice.SecondaryLocaleList).length > 0 && (
                <div>{JSON.parse(voice.SecondaryLocaleList).length} 种语言</div>
              )}
            </div>
          </div>
        </div>

        {showDetail && (
          <div className="pb-1">
            {voice.StyleList && (
              <>
                <div className="my-1 border-t bg-zinc-500" />
                <div className="text-sm">语气</div>
                <div className="text-left text-wrap">
                  {JSON.parse(voice.StyleList).map((style: string) => (
                    <div
                      className="whitespace-normal inline-block border mt-1 mr-1 pr-1 rounded-sm"
                      key={style}
                    >
                      {StylesEmoji[style]?.emoji}
                      <span className="text-xs">{StylesEmoji[style]?.name || style}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {voice.RolePlayList && (
              <div>
                <div className="mt-2 mb-1 border-t bg-zinc-500" />
                <span className="text-sm text-nowrap">角色</span>
                <div className="text-left text-wrap">
                  {JSON.parse(voice.RolePlayList).map((role: string) => (
                    <div
                      className="whitespace-normal inline-block border mt-1 mr-1 px-1 rounded-sm"
                      key={role}
                    >
                      {/* {rolePlayEmoji[role]?.emoji} */}
                      <span className="text-xs">{rolePlayEmoji[role]?.name || role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {voice.SecondaryLocaleList && (
              <div className="">
                <div className="my-1 border-t bg-zinc-500" />
                <span className="text-sm text-nowrap">语言种类</span>
                <div className="text-left text-wrap">
                  {JSON.parse(voice.SecondaryLocaleList).map((locale: string) => (
                    <div
                      className="whitespace-normal inline-block border mt-1 mr-1 px-1 rounded-sm"
                      key={locale}
                    >
                      <span className="text-xs">{locale}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Button>
  );
};

export default Card;
