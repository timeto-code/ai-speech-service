"use client";

import { useVoiceStore } from "@/store/useVoiceStore";
import React, { useEffect } from "react";
import Combobox from "./Combobox";
import { fetchLanguageList } from "@/actions/TTS";
import WCombobox from "./WCombobox";

const CountryCodeMap = {
  CN: "中文 (简体中文)",
  TW: "中文 (中国台湾)",
  HK: "中文 (中国香港)",
  GB: "English (英国)",
  US: "English (美国)",
  JP: "日本語 (日本)",
  KR: "한국어 (韩国)",
  ZA: "Afrikaans (南非)",
  ET: "አማርኛ (埃塞俄比亚)",
  AE: "العربية (阿联酋)",
  BH: "العربية (巴林)",
  DZ: "العربية (阿尔及利亚)",
  EG: "العربية (埃及)",
  IQ: "العربية (伊拉克)",
  JO: "العربية (约旦)",
  KW: "العربية (科威特)",
  LB: "العربية (黎巴嫩)",
  LY: "العربية (利比亚)",
  MA: "العربية (摩洛哥)",
  OM: "العربية (阿曼)",
  QA: "العربية (卡塔尔)",
  SA: "العربية (沙特阿拉伯)",
  SY: "العربية (叙利亚)",
  TN: "العربية (突尼斯)",
  YE: "العربية (也门)",
  AZ: "Azərbaycanca (阿塞拜疆)",
  BG: "Български (保加利亚)",
  BD: "বাংলা (孟加拉国)",
  IN: "हिन्दी (印度)",
  BA: "Bosanski (波斯尼亚和黑塞哥维那)",
  ES: "Español (西班牙)",
  CZ: "Čeština (捷克共和国)",
  DK: "Dansk (丹麦)",
  AT: "Deutsch (奥地利)",
  CH: "Deutsch (瑞士)",
  DE: "Deutsch (德国)",
  GR: "Ελληνικά (希腊)",
  AU: "English (澳大利亚)",
  CA: "English (加拿大)",
  IE: "English (爱尔兰)",
  KE: "Swahili (肯尼亚)",
  NG: "English (尼日利亚)",
  NZ: "English (新西兰)",
  PH: "Filipino (菲律宾)",
  SG: "English (新加坡)",
  TZ: "Swahili (坦桑尼亚)",
  AR: "Español (阿根廷)",
  BO: "Español (玻利维亚)",
  CL: "Español (智利)",
  CO: "Español (哥伦比亚)",
  CR: "Español (哥斯达黎加)",
  CU: "Español (古巴)",
  DO: "Español (多米尼加共和国)",
  EC: "Español (厄瓜多尔)",
  GQ: "Español (赤道几内亚)",
  GT: "Español (危地马拉)",
  HN: "Español (洪都拉斯)",
  MX: "Español (墨西哥)",
  NI: "Español (尼加拉瓜)",
  PA: "Español (巴拿马)",
  PE: "Español (秘鲁)",
  PR: "Español (波多黎各)",
  PY: "Español (巴拉圭)",
  SV: "Español (萨尔瓦多)",
  UY: "Español (乌拉圭)",
  VE: "Español (委内瑞拉)",
  EE: "Eesti (爱沙尼亚)",
  IR: "فارسی (伊朗)",
  FI: "Suomi (芬兰)",
  BE: "Nederlands (比利时)",
  FR: "Français (法国)",
  IL: "עברית (以色列)",
  HR: "Hrvatski (克罗地亚)",
  HU: "Magyar (匈牙利)",
  AM: "Հայերեն (亚美尼亚)",
  ID: "Bahasa Indonesia (印尼)",
  IS: "Íslenska (冰岛)",
  IT: "Italiano (意大利)",
  GE: "ქართული (格鲁吉亚)",
  KZ: "Қазақ тілі (哈萨克斯坦)",
  KH: "ភាសាខ្មែរ (柬埔寨)",
  LA: "ພາສາລາວ (老挝)",
  LT: "Lietuvių (立陶宛)",
  LV: "Latviešu (拉脱维亚)",
  MK: "Македонски (北马其顿)",
  MN: "Монгол хэл (蒙古)",
  MY: "Bahasa Melayu (马来西亚)",
  MT: "Malti (马耳他)",
  MM: "မြန်မာစာ (缅甸)",
  NO: "Norsk (挪威)",
  NP: "नेपाली (尼泊尔)",
  NL: "Nederlands (荷兰)",
  PL: "Polski (波兰)",
  AF: "دری (阿富汗)",
  BR: "Português (巴西)",
  PT: "Português (葡萄牙)",
  RO: "Română (罗马尼亚)",
  RU: "Русский (俄罗斯)",
  LK: "සිංහල (斯里兰卡)",
  SK: "Slovenčina (斯洛伐克)",
  SI: "Slovenščina (斯洛文尼亚)",
  SO: "Soomaali (索马里)",
  AL: "Shqip (阿尔巴尼亚)",
  Latn: "拉丁文",
  RS: "Српски (塞尔维亚)",
  SE: "Svenska (瑞典)",
  TH: "ไทย (泰国)",
  TR: "Türkçe (土耳其)",
  UA: "Українська (乌克兰)",
  PK: "اردو (巴基斯坦)",
  UZ: "O‘zbek (乌兹别克斯坦)",
  VN: "Tiếng Việt (越南)",
} as Record<string, string>;

const LanguageCombobox = () => {
  const [value, setValue] = React.useState<string>("CN");
  const [languages, setLanguages] = React.useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchLanguage = async () => {
      const res = await fetchLanguageList();

      const languageList = res.map((item) => ({
        label: CountryCodeMap[item],
        value: item,
      }));

      setLanguages(languageList);
    };

    fetchLanguage();
  }, []);

  useEffect(() => {
    useVoiceStore.setState({ language: value });
  }, [value]);

  return (
    <Combobox
      options={languages}
      value={value}
      setValue={setValue}
      className="h-[calc(100vh-75px)] w-[240px] py-1 px-0"
    />
  );
};

export default LanguageCombobox;
