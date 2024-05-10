"use client";

import { useVoiceStore } from "@/store/useVoiceStore";
import React from "react";
import Card, { StylesEmoji, rolePlayEmoji } from "./Card";
import Image from "next/image";

const VoiceDetial = () => {
  const voice = useVoiceStore((state) => state.voice);

  if (!voice) return null;

  return (
    <div className="w-full h-full border rounded-sm">
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
      </div>
    </div>
  );
};

export default VoiceDetial;
