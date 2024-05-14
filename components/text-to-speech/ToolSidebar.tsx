"use client";

import { cn, generateSpan } from "@/lib/utils";
import { useSSMLNodeStore } from "@/store/useSSMLStore";
import { useVoiceStore } from "@/store/useVoiceStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosCheckboxOutline } from "react-icons/io";
import { StylesEmoji, rolePlayEmoji } from "./Card";
import BadgeButton from "./tool-sidebar/BadgeButton";
import Separator from "./tool-sidebar/Separator";
import { toast } from "sonner";
import { Bold } from "lucide-react";

const Break = [250, 500, 750, 1000, 1250];
const roleMap = {
  default: "",
  Narrator: "旁白",
  YoungAdultMale: "男青年",
  YoungAdultFemale: "女青年",
  OlderAdultMale: "男中年",
  SeniorFemale: "女老年",
  SeniorMale: "男老年",
  OlderAdultFemale: "女中年",
  Boy: "男孩",
  Girl: "女孩",
} as Record<string, string>;

const RegionMap = {
  "zh-CN-shaanxi": {
    emoji: "🏞️",
    name: "陕西",
  },
  "zh-CN-sichuan": {
    emoji: "🏞️",
    name: "四川",
  },
  "zh-CN-shanxi": {
    emoji: "🏞️",
    name: "山西",
  },
  "zh-CN-anhui": {
    emoji: "🏞️",
    name: "安徽",
  },
  "zh-CN-hunan": {
    emoji: "🏞️",
    name: "湖南",
  },
  "zh-CN-gansu": {
    emoji: "🏞️",
    name: "甘肃",
  },
  "zh-CN-shandong": {
    emoji: "🏞️",
    name: "山东",
  },
  "zh-CN-henan": {
    emoji: "🏞️",
    name: "河南",
  },
  "zh-CN-liaoning": {
    emoji: "🏞️",
    name: "辽宁",
  },
  "zh-TW": {
    emoji: "🏞️",
    name: "台湾",
  },
  "nan-CN": {
    emoji: "🏞️",
    name: "闽南",
  },
  "yue-CN": {
    emoji: "🏞️",
    name: "粤语（广东）",
  },
  "wuu-CN": {
    emoji: "🏞️",
    name: "吴语（上海、苏南等地）",
  },
} as Record<string, { emoji: string; name: string }>;

const ToolSidebar = () => {
  const [key, setKey] = useState(0);

  const voice = useVoiceStore((state) => state.voice);
  const [showStyle, setShowStyle] = useState(true);
  const [showRole, setShowRole] = useState(true);
  const [showLocale, setShowLocale] = useState(true);
  const [showTone, setShowTone] = useState(true);
  const [showBreak, setShowBreak] = useState(true);

  // xml 节点管理
  const { addBreak, deleteBreak, addPhoneme, deletePhoneme, addMsttsExpressAs, deleteMsttsExpressAs } =
    useSSMLNodeStore.getState();

  // 防止光标在input中时，触发 break 功能

  // 当前风格 & 角色
  const [currentStyle, setCurrentStyle] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<string>("default");

  const [rangeState, setRangeState] = useState<Range | null>(null);
  // 无读音声调按钮不可用
  const [text, setText] = useState<string>("");
  const [pinYin, setPinYin] = useState<string>("");

  // 停顿
  const [breakTime, setBreakTime] = useState<number>(250);

  const windowSelection = () => {
    const selection = window.getSelection();
    const content = selection?.toString();
    const range = selection?.getRangeAt(0);
    const fragment = range?.cloneContents();

    return { selection, content, range, fragment };
  };

  const generateNode = (startSpan: HTMLSpanElement, contentSpan: HTMLSpanElement, endSpan: HTMLSpanElement) => {
    const { selection, content, range, fragment } = windowSelection();
    if (!selection || !content || !range || !fragment) return;

    // 获取父元素
    const parentElement = selection?.anchorNode?.parentNode as HTMLElement;
    if (
      parentElement?.nodeName === "SPAN" &&
      parentElement?.getAttribute("type") &&
      parentElement?.getAttribute("type") !== ""
    ) {
      // return alert("声音角色不能嵌套");
      return toast("", {
        position: "bottom-left",
        description: "声音角色不能嵌套",
        style: {
          width: "auto",
          backgroundColor: "#fcd14f",
          border: "1px solid #fbbd04",
          color: "#000",
          fontWeight: 600,
        },
      });
    }

    const removeElements = [] as Element[];

    // 获取内部元素 break、phoneme、等...
    fragment.childNodes.forEach((node, index) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // 创建一个文本节点并追加到 contentSpan
        const textNode = document.createTextNode(node!.textContent!);
        contentSpan.appendChild(textNode);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const type = element.getAttribute("type");
        if (type === "phoneme" || type === "break") {
          const span = document.createElement("span");
          span.textContent = node.textContent;
          span.className = "text-xs text-[#0078d4] h-4 font-bold select-none";
          span.setAttribute("id", element.getAttribute("id")!);
          span.setAttribute("type", element.getAttribute("type")!);
          contentSpan.appendChild(span);
        } else {
          // 创建纯文本节点
          const textNode = document.createTextNode(node!.textContent!);
          contentSpan.appendChild(textNode);
        }
      }

      removeElements.push(node as Element);
    });

    removeElements.forEach((element) => {
      element.remove();
    });

    // 将span标签替换选中的文本
    range?.deleteContents();
    range?.insertNode(endSpan);
    range?.insertNode(contentSpan);
    range?.insertNode(startSpan);

    // 清除选中文本
    selection?.removeAllRanges();
  };

  // 添加说话风格
  const handleStyle = (style: string) => {
    setCurrentStyle((prev) => (prev === style ? "" : style));

    // 标签唯一标识
    const name = new Date().getTime().toString();

    // 起始标签
    const startSpan = generateSpan({ name, underline: true });
    startSpan.textContent = `<#${currentRole && currentRole !== "default" ? `${roleMap[currentRole]} - ` : ``}${
      StylesEmoji[style]?.name || style
    }`;

    // 内容标签
    const contentSpan = generateSpan({ name, type: "mstts:express-as", underline: true });
    if (currentRole) contentSpan.setAttribute("role", `${currentRole}`);
    contentSpan.setAttribute("style", `${style}`);
    contentSpan.contentEditable = "true";

    // 结束标签
    const endSpan = generateSpan({ name, underline: true });
    endSpan.textContent = `#>`;

    generateNode(startSpan, contentSpan, endSpan);

    setCurrentStyle("");
  };

  // 添加角色
  const handleRole = (role: string) => {
    const { content } = windowSelection();

    if (!content || role === "default") {
      return setCurrentRole((prev) => (prev === role ? "" : role));
    }

    // 标签唯一标识
    const name = new Date().getTime().toString();

    // 起始标签
    const startSpan = generateSpan({ name, underline: true });
    startSpan.textContent = `<#${roleMap[role]}${
      currentStyle ? `- ${StylesEmoji[currentStyle]?.name || currentStyle}` : ""
    }`;

    // 内容标签
    const contentSpan = generateSpan({ name, type: "mstts:express-as", underline: true });
    contentSpan.setAttribute("role", `${role}`);
    if (currentStyle) contentSpan.setAttribute("style", `${currentStyle}`);
    contentSpan.contentEditable = "true";

    // 结束标签
    const endSpan = generateSpan({ name, underline: true });
    endSpan.textContent = `#>`;

    generateNode(startSpan, contentSpan, endSpan);
  };

  // 添加多语言语种
  const handleLang = (lang: string) => {
    // 标签唯一标识
    const name = new Date().getTime().toString();

    // 起始标签
    const startSpan = generateSpan({ name, underline: true });
    startSpan.textContent = `<#${RegionMap[lang]?.name || lang}`;

    // 内容标签 <lang xml:lang="zh-CN-hunan">
    const contentSpan = generateSpan({ name, type: "lang", underline: true });
    if (currentRole) contentSpan.setAttribute("role", `${currentRole}`);
    contentSpan.setAttribute("xml:lang", `${lang}`);
    contentSpan.contentEditable = "true";

    // 结束标签
    const endSpan = generateSpan({ name, underline: true });
    endSpan.textContent = `#>`;

    generateNode(startSpan, contentSpan, endSpan);
  };

  const getToneSelection = () => {
    const { content, range } = windowSelection();
    if (!content || !range) return;
    setRangeState(range);
    setText(content[0]);
  };

  // 添加声调
  const handleTone = () => {
    const id = new Date().getTime().toString();
    const span = generateSpan({ id, type: "phoneme" });
    span.textContent = `[ ${pinYin} ]`;

    // 将插入点移动到选区的末尾
    rangeState?.collapse(false);

    // 插入span标签
    rangeState?.insertNode(span);

    // 创建 xml 节点 <phoneme alphabet="sapi" ph="de 2">的</phoneme>
    const xmlNode = `<phoneme alphabet="sapi" ph="${pinYin}">${text}</phoneme>`;
    const xmlNodeObj = { id, node: xmlNode };
    addPhoneme(xmlNodeObj);

    setRangeState(null);
    setText("");
    setPinYin("");
  };

  const getBreakSelection = () => {
    const { range } = windowSelection();
    if (!range) return;
    setRangeState(range);
  };

  // 添加停顿
  const handleBreak = (time: number, isCustomBreak?: boolean) => {
    const { range } = windowSelection();
    let selectionRange = isCustomBreak ? rangeState : range;

    const id = new Date().getTime().toString();
    const span = generateSpan({ id, type: "break" });
    span.textContent = `<${time}ms>`;

    // 创建 xml 节点 <break time="500ms" />
    const xmlNode = `<break time="${time}ms"/>`;
    const xmlNodeObj = { id, node: xmlNode };
    addBreak(xmlNodeObj);

    // 将span标签替换选中的文本
    selectionRange?.deleteContents();
    selectionRange?.insertNode(span);

    setRangeState(null);
  };

  useEffect(() => {
    setShowStyle(true);
    setShowRole(true);
    setShowLocale(true);
    setShowTone(true);
    setShowBreak(true);
    setCurrentStyle("");
    setCurrentRole("");
    setKey((prev) => prev + 1);
  }, [voice]);

  if (!voice) return <div className="w-full h-full border rounded-sm overflow-auto"></div>;
  return (
    <div className="w-full h-full border rounded-sm overflow-auto" key={key}>
      <div className="w-full flex items-center gap-2 px-2 pt-2 ">
        <div className="h-10 w-10 relative">
          <Image
            src={voice.Gender === "Male" ? "/image/man.png" : "/image/woman.png"}
            alt=""
            fill
            sizes="48"
            className="object-contain"
          />
        </div>
        <span>
          {voice.LocalName}
          {roleMap[currentRole] && ` - ${roleMap[currentRole]}`}
        </span>
      </div>

      {voice.RolePlayList && (
        <div className="px-1 pb-1">
          <Separator label="角色" count={JSON.parse(voice.RolePlayList).length} handleClick={setShowRole} />
          {showRole && (
            <div className="text-left text-wrap m-1">
              <BadgeButton title="默认" titleMap={rolePlayEmoji} handleClick={handleRole} className="px-1" />
              {JSON.parse(voice.RolePlayList).map((role: string) => (
                <BadgeButton
                  key={role}
                  title={role}
                  titleMap={rolePlayEmoji}
                  handleClick={handleRole}
                  className="px-1"
                />
              ))}
            </div>
          )}
        </div>
      )}
      {voice.StyleList && (
        <div className="px-1 pb-1">
          <Separator label="语气" count={JSON.parse(voice.StyleList).length} handleClick={setShowStyle} />
          {showStyle && (
            <div className="text-left text-wrap m-1">
              {JSON.parse(voice.StyleList).map((style: string) => (
                <BadgeButton
                  key={style}
                  title={style}
                  titleMap={StylesEmoji}
                  handleClick={handleStyle}
                  showEmoji
                  className="pr-1 pl-[2px]"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {voice.SecondaryLocaleList && (
        <div className="px-1 pb-1">
          <Separator label="语言种类" handleClick={setShowLocale} />
          {showLocale && (
            <div className="text-left text-wrap m-1">
              {JSON.parse(voice.SecondaryLocaleList).map((locale: string) => (
                <BadgeButton
                  key={locale}
                  title={locale}
                  titleMap={RegionMap}
                  handleClick={handleLang}
                  className="px-1"
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-1 pb-1">
        <Separator label="声调" handleClick={setShowTone} />
        {showTone && (
          <div className="flex gap-1 items-center m-1 py-1">
            <span className="w-5 text-lg font-semibold">{text || "字"}</span>
            <input
              type="text"
              placeholder="请输入拼音..."
              className="w-full h-6 text-sm border  text-start px-1 rounded-[2px] outline-none focus:outline-none"
              value={pinYin}
              onChange={(e) => {
                // 只能输入字母
                // const value = e.target.value.replace(/[^a-zA-Z]/g, "");
                setPinYin(e.target.value);
              }}
              onFocus={getToneSelection}
            />
            <button disabled={pinYin === ""} onClick={handleTone}>
              <IoIosCheckboxOutline
                size={30}
                className={cn(pinYin === "" ? "contrast-0 text-zinc-400/20" : "text-zinc-600 hover:text-slate-600/80")}
              />
            </button>
          </div>
        )}
      </div>
      <div className="px-1">
        <Separator label="停顿" handleClick={setShowBreak} />
        {showBreak && (
          <div className="m-1">
            <div className="flex items-center gap-1 w-full mt-1">
              <div className="w-full relative h-6">
                <input
                  type="number"
                  max={5000}
                  min={250}
                  value={breakTime}
                  className="w-full h-full text-sm border  text-start px-1 rounded-[2px] outline-none focus:outline-none"
                  onChange={(e) => {
                    setBreakTime(
                      Number(e.target.value) < 250 ? 250 : Number(e.target.value) > 5000 ? 5000 : Number(e.target.value)
                    );
                  }}
                  onFocus={getBreakSelection}
                />
                <p className="text-nowrap text-sm absolute right-[1px] top-[2px] h-[22px] content-center bg-white pointer-events-none">
                  毫秒（ms）
                </p>
              </div>
              <button
                onClick={() => {
                  handleBreak(breakTime, true);
                }}
              >
                <IoIosCheckboxOutline size={30} className={cn("text-zinc-600 hover:text-slate-600/80")} />
              </button>
            </div>
            {Break.map((time) => (
              <button
                className="border mt-1 mr-1 px-1 rounded-sm hover:bg-slate-400/50 transition-colors duration-200 text-sm"
                key={time}
                onClick={() => {
                  handleBreak(time);
                }}
              >
                {time}ms
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolSidebar;
