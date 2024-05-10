"use client";

import { useVoiceStore } from "@/store/useVoiceStore";
import { Voice } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import "../../styles/DivEditor.css";
import { Button } from "../ui/button";
import { useSSMLStore } from "@/store/useSSMLStore";
import BadgeButton from "../BadgeButton";

// angrychat - 生气聊天
// cheerful - 欢快
// customerservice - 客户服务
// empathetic - 有同理心的
// excited - 兴奋的
// friendly - 友好的
// hopeful - 充满希望的
// narration-professional - 专业解说
// newscast-casual - 随意新闻播报
// newscast-formal - 正式新闻播报
// sad - 悲伤的
// shouting - 大喊
// terrified - 恐惧的
// unfriendlywhispering - 不友好的耳语
// angry - 生气
// chat - 聊天
// unfriendly - 不友好的
// whispering - 耳语
// newscast - 新闻播报
// assistant - 助手
// calm - 平静的
// affectionate - 充满爱心的
// disgruntled - 不满的
// embarrassed - 尴尬的
// fearful - 害怕的
// gentle - 温柔的
// serious - 严肃的
// depressed - 抑郁的
// envious - 嫉妒的
// chat-casual - 随意聊天
// lyrical - 抒情的
// poetry-reading - 朗诵诗歌
// sorry - 遗憾的
// whisper - 耳语
// advertisement-upbeat - 活泼的广告
// documentary-narration - 纪录片解说
// narration-relaxed - 轻松解说
// sports-commentary - 体育评论
// sports-commentary-excited - 兴奋的体育评论

const StylesEmoji: Record<string, { emoji: string; name: string }> = {
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

const rolePlayEmoji: Record<string, { emoji: string; name: string }> = {
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

interface VoiceCardProps {
  voice: Voice;
}

const VoiceCard = ({ voice }: VoiceCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const currentVoce = useSSMLStore((state) => state.currentVoceSection.voice);

  const handleStyle = (style: string) => {
    // 获取选中的文本
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (!selectedText) return;

    const span = document.createElement("span");
    // span.style.color = "#0078d4";
    span.textContent = `${selectedText}` || "";
    span.className = "yu-qi";
    span.setAttribute("style-name", style);
    span.setAttribute("data-before", `[${StylesEmoji[style]?.name || style}`);
    span.setAttribute("data-after", `]`);
    // span.contentEditable = "false";

    // 将span标签替换选中的文本
    const range = selection?.getRangeAt(0);
    range?.deleteContents();
    range?.insertNode(span);

    // 清除选中文本
    selection?.removeAllRanges();
  };

  return (
    <div className="flex items-start">
      <div className="border border-zinc-400 p-1 rounded-sm flex-1" onClick={(e) => {}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="rounded-full h-6 w-6 relative">
              <Image
                src={voice.Gender === "Male" ? "/image/man.png" : "/image/woman.png"}
                alt=""
                fill
                sizes="24"
                className="object-contain"
              />
            </div>
            <Button
              variant="link"
              className="p-0 h-5"
              onClick={() => {
                useVoiceStore.setState({ voice: voice });
                useVoiceStore.setState({
                  voiceRefreshed: new Date().getTime(),
                });
                useVoiceStore.setState({ currentVoice: voice.ShortName });
              }}
            >
              <span className="text-sm ml-2">{voice.LocalName}</span>
            </Button>
          </div>
          {voice.StyleList || voice.RolePlayList || voice.SecondaryLocaleList ? (
            <button
              className="flex items-center justify-center mr-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDetail(!showDetail);
              }}
            >
              <Ellipsis className="h-5 w-5 cursor-pointer" />
            </button>
          ) : null}
        </div>
        {showDetail && (
          <>
            <div className="py-1">
              {voice.StyleList && (
                <div>
                  <div className="my-1 border-t bg-zinc-500" />
                  <div className="text-sm text-nowrap">语气</div>
                  <div>
                    {JSON.parse(voice.StyleList).map((style: string) => (
                      <BadgeButton
                        key={style}
                        disabled={currentVoce?.ShortName !== voice.ShortName}
                        handleClick={() => {
                          handleStyle(style);
                        }}
                      >
                        <div className="flex items-center">
                          {StylesEmoji[style]?.emoji}
                          <span className="text-xs">{StylesEmoji[style]?.name || style}</span>
                        </div>
                      </BadgeButton>
                    ))}
                  </div>
                </div>
              )}
              {voice.RolePlayList && (
                <div>
                  <div className="mt-2 mb-1 border-t bg-zinc-500" />
                  <span className="text-sm text-nowrap">角色</span>
                  <div>
                    {JSON.parse(voice.RolePlayList).map((role: string) => (
                      <BadgeButton
                        handleClick={() => {}}
                        key={role}
                        disabled={currentVoce?.ShortName !== voice.ShortName}
                      >
                        <div className="flex items-center pl-1">
                          {/* {rolePlayEmoji[role]?.emoji} */}
                          <span className="text-xs">{rolePlayEmoji[role]?.name || role}</span>
                        </div>
                      </BadgeButton>
                    ))}
                  </div>
                </div>
              )}
              {voice.SecondaryLocaleList && (
                <div className="">
                  <div className="my-1 border-t bg-zinc-500" />
                  <span className="text-sm text-nowrap">语言种类</span>
                  <div className="h-24 overflow-auto">
                    {JSON.parse(voice.SecondaryLocaleList).map((locale: string) => (
                      <BadgeButton
                        handleClick={() => {}}
                        key={locale}
                        disabled={currentVoce?.ShortName !== voice.ShortName}
                      >
                        <div className="flex items-center pl-1">
                          <span className="text-xs">{locale}</span>
                        </div>
                      </BadgeButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceCard;
