import { Voice } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { FcBusinessman, FcBusinesswoman, FcCloseUpMode } from "react-icons/fc";
import { Separator } from "./ui/separator";
import { CloudSnow } from "lucide-react";
import { IoIosClose } from "react-icons/io";

const SelectedVoiceCard = () => {
  const voice2 = {
    Name: "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoMultilingualNeural)",
    DisplayName: "Xiaoxiao Multilingual",
    LocalName: "晓晓 多语言",
    ShortName: "zh-CN-XiaoxiaoMultilingualNeural",
    Gender: "Female",
    Locale: "zh-CN",
    LocaleName: "Chinese (Mandarin, Simplified)",
    SecondaryLocaleList:
      '["af-ZA","am-ET","ar-EG","ar-SA","az-AZ","bg-BG","bn-BD","bn-IN","bs-BA","ca-ES","cs-CZ","cy-GB","da-DK","de-AT","de-CH","de-DE","el-GR","en-AU","en-CA","en-GB","en-IE","en-IN","en-US","es-ES","es-MX","et-EE","eu-ES","fa-IR","fi-FI","fil-PH","fr-BE","fr-CA","fr-CH","fr-FR","ga-IE","gl-ES","he-IL","hi-IN","hr-HR","hu-HU","hy-AM","id-ID","is-IS","it-IT","ja-JP","jv-ID","ka-GE","kk-KZ","km-KH","kn-IN","ko-KR","lo-LA","lt-LT","lv-LV","mk-MK","ml-IN","mn-MN","ms-MY","mt-MT","my-MM","nb-NO","ne-NP","nl-BE","nl-NL","pl-PL","ps-AF","pt-BR","pt-PT","ro-RO","ru-RU","si-LK","sk-SK","sl-SI","so-SO","sq-AL","sr-RS","su-ID","sv-SE","sw-KE","ta-IN","te-IN","th-TH","tr-TR","uk-UA","ur-PK","uz-UZ","vi-VN","zh-CN","zh-HK","zh-TW","zu-ZA"]',
    SampleRateHertz: "24000",
    VoiceType: "Neural",
    Status: "GA",
    StyleList: "",
    RolePlayList: "",
  };

  return (
    <div className="border p-1 rounded-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-end">
          <div className="rounded-full h-6 w-6 relative">
            <Image
              src={
                voice2.Gender === "Male"
                  ? "/image/icons8-male-96.png"
                  : "/image/icons8-female-96.png"
              }
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm ml-2">{voice2.LocalName}</span>
        </div>
        <button>
          <IoIosClose className="h-5 w-5 cursor-pointer" />
        </button>
      </div>
      <Separator className="my-1" />
      {voice2.StyleList && (
        <div>
          <span>语气风格: {voice2.StyleList}</span>
        </div>
      )}
      {voice2.RolePlayList && (
        <div>
          <span>角色扮演: {voice2.RolePlayList}</span>
        </div>
      )}
      {voice2.SecondaryLocaleList && (
        <div>
          <span>语言种类: {voice2.SecondaryLocaleList}</span>
        </div>
      )}
    </div>
  );
};

export default SelectedVoiceCard;
