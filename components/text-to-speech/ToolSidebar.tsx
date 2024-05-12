"use client";

import { cn } from "@/lib/utils";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { StylesEmoji, rolePlayEmoji } from "./Card";
import { useSSMLNodeStore, useSSMLStore } from "@/store/useSSMLStore";
import { IoIosCheckboxOutline } from "react-icons/io";

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

const ToolSidebar = () => {
  const [key, setKey] = useState(0);

  const voice = useVoiceStore((state) => state.voice);
  const [showStyle, setShowStyle] = useState(true);
  const [showRole, setShowRole] = useState(true);
  const [showLocale, setShowLocale] = useState(true);
  const [showTone, setShowTone] = useState(true);
  const [showBreak, setShowBreak] = useState(true);

  // xml 节点管理
  const {
    addBreak,
    deleteBreak,
    addPhoneme,
    deletePhoneme,
    addMsttsExpressAs,
    deleteMsttsExpressAs,
  } = useSSMLNodeStore.getState();

  // 防止光标在input中时，触发 break 功能

  // 当前风格 & 角色
  const [currentStyle, setCurrentStyle] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<string>("default");

  const [range, setRange] = useState<Range | null>(null);
  // 无读音声调按钮不可用
  const [text, setText] = useState<string>("");
  const [pinYin, setPinYin] = useState<string>("");

  // 停顿
  const [breakTime, setBreakTime] = useState<number>(250);

  const getToneSelection = () => {
    const winSelection = window.getSelection();
    // console.log("selection", winSelection);
    if (winSelection?.rangeCount === 0) return;
    setRange(winSelection!.getRangeAt(0));
    const content = winSelection!.toString()[0];
    setText(content);
  };

  const getBreakSelection = () => {
    const winSelection = window.getSelection();
    // console.log("selection", winSelection);
    if (winSelection?.rangeCount === 0) return;
    setRange(winSelection!.getRangeAt(0));
  };

  // 清除说话风格
  const clearStyle = (index: string) => {
    const spans = document.querySelectorAll(`span[name="${index}"]`);
    spans.forEach((span) => {
      const type = span.getAttribute("type");
      if (type) {
        span.insertAdjacentHTML("beforebegin", span.innerHTML);
        span.remove();
      } else {
        span.remove();
      }
    });
  };

  // 添加说话风格
  const handleStyle = (style: string) => {
    setCurrentStyle((prev) => (prev === style ? "" : style));

    // 获取选中的文本
    const selection = window.getSelection();
    if (!selection) return;

    const selectionStr = selection?.toString();
    if (!selectionStr) return;

    // 获取父元素
    const parentElement = selection?.anchorNode?.parentNode;
    if (parentElement?.nodeName === "SPAN") {
      return alert("声音角色不能嵌套");
    }

    const selectedRange = selection?.getRangeAt(0);
    if (!selectedRange) return;
    const textFragment = selectedRange.cloneContents();

    const name = new Date().getTime();
    const spanStart = document.createElement("span");
    spanStart.setAttribute("name", `${name}`);
    spanStart.className =
      "text-xs text-[#0078d4] h-4 font-bold underline underline-offset-4 select-none";
    spanStart.textContent = `<#${
      currentRole && currentRole !== "default" ? `${roleMap[currentRole]} - ` : ``
    }${StylesEmoji[style]?.name || style}`;
    spanStart.contentEditable = "false";

    // 将DocumentFragment转换为HTML字符串并设置为spanContent的内容
    const tempDiv = document.createElement("div");
    // tempDiv.appendChild(textFragment);
    tempDiv.innerHTML = textFragment.lastChild?.textContent || "";

    const spanContent = document.createElement("span");
    // spanContent.setAttribute("name", `${name}`);
    spanContent.setAttribute("type", "mstts:express-as");
    if (currentRole) spanContent.setAttribute("role", `${currentRole}`);
    spanContent.setAttribute("style", `${style}`);
    spanContent.className = "underline underline-offset-4 decoration-[#0078d4] select-none";
    // 获取内部元素 break、phoneme、等...
    textFragment.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // 创建一个文本节点并追加到 spanContent
        const textNode = document.createTextNode(node!.textContent!);
        spanContent.appendChild(textNode);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node.cloneNode(true) as Element;

        const span = document.createElement("span");
        span.textContent = node.textContent;
        span.className = "text-xs text-[#0078d4] h-4 font-bold select-none";
        span.setAttribute("id", element.getAttribute("id")!);
        span.setAttribute("type", element.getAttribute("type")!);

        spanContent.appendChild(span);
      }
    });

    // 同步创建 xml 节点
    // const xmlNode = `<s/><mstts:express-as${
    //   currentRole && currentRole !== "default" ? ` role="${currentRole}"` : ""
    // } style="${style}">${tempDiv.innerHTML || ""}</mstts:express-as><s/>`;
    // const xmlNodeObj = { id: `${name}`, node: xmlNode };
    // addMsttsExpressAs(xmlNodeObj);

    const spanEnd = document.createElement("span");
    spanEnd.setAttribute("name", `${name}`);
    spanEnd.textContent = `#>`;
    spanEnd.className =
      "text-xs text-[#0078d4] h-4 font-bold underline underline-offset-4 select-none";
    spanEnd.contentEditable = "false";

    const obs1 = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // console.log("mutation??xx??", JSON.stringify(mutation, null, 2));

        // 获取span元素，并根据name属性筛选
        const span = mutation.target as HTMLElement;
        // console.log("span", span);
        const removed = mutation.removedNodes;
        // console.log("removed", removed);

        mutation.removedNodes.forEach((node) => {
          // console.log("Element removed:", node);

          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            if (!element) return;
            const nodeName = element.getAttribute("name");
            // console.log("node name attribute", nodeName);
            clearStyle(nodeName!);
          }
        });
      });
    });

    // 观察父元素的子节点变化
    if (parentElement) {
      obs1.observe(parentElement, {
        childList: true,
        subtree: true,
      });
    }

    // 将span标签替换选中的文本
    selectedRange?.deleteContents();
    selectedRange?.insertNode(spanEnd);
    selectedRange?.insertNode(spanContent);
    selectedRange?.insertNode(spanStart);

    // 清除选中文本
    selection?.removeAllRanges();

    setCurrentStyle("");
  };

  // 添加角色
  const handleRole = (role: string) => {
    // 获取选中的文本
    const selection = window.getSelection();
    const selectionStr = selection?.toString();

    if (!selectionStr || role === "default") {
      return setCurrentRole((prev) => (prev === role ? "" : role));
    }

    if (!selection) return;

    const parentElement = selection?.anchorNode?.parentNode;
    if (parentElement?.nodeName === "SPAN") {
      return alert("声音角色不能嵌套");
    }

    const selectedRange = selection?.getRangeAt(0);
    if (!selectedRange) return;
    const textFragment = selectedRange.cloneContents();

    const name = new Date().getTime();
    const spanStart = document.createElement("span");
    spanStart.setAttribute("name", `${name}`);
    spanStart.className =
      "text-xs text-[#0078d4] h-4 font-bold underline underline-offset-4 select-none";
    spanStart.textContent = `<#${roleMap[role]}${
      currentStyle ? `- ${StylesEmoji[currentStyle]?.name || currentStyle}` : ""
    }`;
    spanStart.contentEditable = "false";

    // 将DocumentFragment转换为HTML字符串并设置为spanContent的内容
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(textFragment);

    const spanContent = document.createElement("span");
    // spanContent.setAttribute("name", `${name}`);
    spanContent.setAttribute("type", "mstts:express-as");
    spanContent.setAttribute("role", `${role}`);
    if (currentStyle) spanContent.setAttribute("style", `${currentStyle}`);
    spanContent.innerHTML = `${tempDiv.innerHTML}` || "";
    spanContent.className = "underline underline-offset-4 decoration-[#0078d4] select-none";
    // 获取内部元素 break、phoneme、等...
    textFragment.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // 创建一个文本节点并追加到 spanContent
        const textNode = document.createTextNode(node!.textContent!);
        spanContent.appendChild(textNode);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node.cloneNode(true) as Element;

        const span = document.createElement("span");
        span.textContent = node.textContent;
        span.className = "text-xs text-[#0078d4] h-4 font-bold select-none";
        span.setAttribute("id", element.getAttribute("id")!);
        span.setAttribute("type", element.getAttribute("type")!);

        spanContent.appendChild(span);
      }
    });

    // 同步创建 xml 节点
    // const xmlNode = `<s/><mstts:express-as role="${role}"${
    //   currentStyle ? ` style="${currentStyle}"` : ""
    // }>${tempDiv.innerHTML || ""}</mstts:express-as><s/>`;
    // const xmlNodeObj = { id: `${name}`, node: xmlNode };
    // addMsttsExpressAs(xmlNodeObj);

    const spanEnd = document.createElement("span");
    spanEnd.setAttribute("id", `${name}`);
    spanEnd.textContent = `#>`;
    spanEnd.className =
      "text-xs text-[#0078d4] h-4 font-bold underline underline-offset-4 select-none";
    spanEnd.contentEditable = "false";

    const obs1 = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // console.log("mutation??xx??", JSON.stringify(mutation, null, 2));

        // 获取span元素，并根据name属性筛选
        const span = mutation.target as HTMLElement;
        // console.log("span", span);
        const removed = mutation.removedNodes;
        // console.log("removed", removed);

        mutation.removedNodes.forEach((node) => {
          // console.log("Element removed:", node);

          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            if (!element) return;
            const nodeName = element.getAttribute("name");
            // console.log("node name attribute", nodeName);
            clearStyle(nodeName!);
          }
        });
      });
    });

    // 观察父元素的子节点变化
    if (parentElement) {
      obs1.observe(parentElement, {
        childList: true,
        subtree: true,
      });
    }

    // 将span标签替换选中的文本
    selectedRange?.deleteContents();
    selectedRange?.insertNode(spanEnd);
    selectedRange?.insertNode(spanContent);

    selectedRange?.insertNode(spanStart);
    // 清除选中文本
    selection?.removeAllRanges();
  };

  // 添加声调
  const handleTone = () => {
    const name = new Date().getTime();
    const span = document.createElement("span");
    span.textContent = `[ ${pinYin} ]`;
    span.setAttribute("id", `${name}`);
    span.setAttribute("type", "phoneme");
    // span.setAttribute("alphabet", "sapi");
    // span.setAttribute("ph", `${pinYin}`);
    span.className = "text-xs text-[#0078d4] h-4 font-bold select-none";
    span.contentEditable = "false";

    // 删除选中的文本
    // selection?.deleteContents();
    // 将插入点移动到选区的末尾
    range?.collapse(false);

    // 插入span标签
    range?.insertNode(span);

    // 创建 xml 节点 <phoneme alphabet="sapi" ph="de 2">的</phoneme>
    const xmlNode = `<phoneme alphabet="sapi" ph="${pinYin}">${text}</phoneme>`;
    const xmlNodeObj = { id: `${name}`, node: xmlNode };
    addPhoneme(xmlNodeObj);

    setRange(null);
    setText("");
    setPinYin("");
  };

  // 添加停顿
  const handleBreak = (time: number) => {
    console.log("2222222222222");
    const divEeditor = useSSMLStore.getState().divEeditor;
    if (!divEeditor) return;

    let sele = range;
    if (!sele) {
      const winSelection = window.getSelection();
      // console.log("selection", winSelection);
      if (winSelection?.rangeCount === 0) return;
      sele = winSelection!.getRangeAt(0);
    }

    if (!sele.toString) return;

    const name = new Date().getTime();
    const span = document.createElement("span");
    span.textContent = `<${time}ms>`;
    span.setAttribute("id", `${name}`);
    span.setAttribute("type", "break");
    // span.setAttribute("time", `${time}ms`);
    span.className = "text-xs text-[#0078d4] h-4 font-bold select-none";
    span.contentEditable = "false";

    // 创建 xml 节点 <break time="500ms" />
    const xmlNode = `<break time="${time}ms"/>`;
    const xmlNodeObj = { id: `${name}`, node: xmlNode };
    addBreak(xmlNodeObj);

    // 将span标签替换选中的文本
    sele?.deleteContents();
    sele?.insertNode(span);

    setRange(null);
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

      {/* <div className="mb-1 border-t bg-zinc-500" /> */}
      {voice.RolePlayList && (
        <>
          <div className="px-1 pb-1">
            <button
              className="w-full h-6 text-sm flex items-center gap-2 px-1 rounded-[2px] hover:bg-zinc-300/50 transition-colors duration-200 ease-in-out"
              onClick={() => setShowRole(!showRole)}
            >
              <div className="border-b border-zinc-600/80 w-full" />
              <div className="flex-1 flex items-center h-full gap-1">
                <span className="text-nowrap">角色</span>
                <span className="text-xs">{JSON.parse(voice.RolePlayList).length}</span>
              </div>
              <div className="border-b border-zinc-600/80 w-full" />
            </button>
            {showRole && (
              <div className="text-left text-wrap m-1">
                <button
                  className={cn(
                    "border mt-1 mr-1 rounded-sm hover:bg-slate-400/50 transition-colors duration-200 p-0",
                    currentRole === "default" ? "bg-slate-400/50" : ""
                  )}
                  onClick={() => handleRole("default")}
                >
                  {/* {rolePlayEmoji[role]?.emoji} */}
                  <div className="text-xs p-1 text-center align-middle">默认</div>
                </button>
                {JSON.parse(voice.RolePlayList).map((role: string) => (
                  <button
                    className={cn(
                      "border mt-1 mr-1 rounded-sm hover:bg-slate-400/50 transition-colors duration-200 p-0",
                      role === currentRole ? "bg-slate-400/50" : ""
                    )}
                    key={role}
                    onClick={() => handleRole(role)}
                  >
                    {/* {rolePlayEmoji[role]?.emoji} */}
                    <div className="text-xs p-1 text-center align-middle">
                      {rolePlayEmoji[role]?.name || role}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      {voice.StyleList && (
        <>
          <div className="px-1 pb-1">
            <button
              className="w-full h-6 text-sm flex items-center gap-2 px-1 rounded-[2px] hover:bg-zinc-300/50 transition-colors duration-200 ease-in-out"
              onClick={() => setShowStyle(!showStyle)}
            >
              <div className="border-b border-zinc-600/80 w-full" />
              <div className="flex flex-1 items-center justify-between gap-1">
                <span className="text-nowrap">语气</span>
                <span className="text-xs">{JSON.parse(voice.StyleList).length}</span>
              </div>
              <div className="border-b border-zinc-600/80 w-full" />
            </button>
            {showStyle && (
              <div className="text-left text-wrap m-1">
                {JSON.parse(voice.StyleList).map((style: string) => (
                  <button
                    className="border mt-1 mr-1 pr-1 rounded-sm hover:bg-slate-400/50 transition-colors duration-200"
                    key={style}
                    onClick={() => handleStyle(style)}
                  >
                    {StylesEmoji[style]?.emoji}

                    <div className="whitespace-normal inline-block h-full pb-[2px] text-xs text-center align-middle">
                      {StylesEmoji[style]?.name || style}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {voice.SecondaryLocaleList && (
        <div className="px-1 pb-1">
          {/* <span className="text-sm text-nowrap">语言种类</span> */}
          <button
            className="w-full h-6 text-sm flex items-center gap-2 px-1 rounded-[2px] hover:bg-zinc-300/50 transition-colors duration-200 ease-in-out"
            onClick={() => setShowLocale(!showLocale)}
          >
            <div className="border-b border-zinc-600/80 w-full" />
            <span className="text-nowrap">语言种类</span>
            <div className="border-b border-zinc-600/80 w-full" />
          </button>
          {showLocale && (
            <div className="text-left text-wrap m-1">
              {JSON.parse(voice.SecondaryLocaleList).map((locale: string) => (
                <div
                  className="whitespace-normal inline-block border mt-1 mr-1 px-1 rounded-sm"
                  key={locale}
                >
                  <span className="text-xs">{locale}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-1 pb-1">
        {/* <span className="text-sm text-nowrap">语言种类</span> */}
        <button
          className="w-full h-6 text-sm flex items-center gap-2 px-1 rounded-[2px] hover:bg-zinc-300/50 transition-colors duration-200 ease-in-out"
          onClick={() => setShowTone(!showTone)}
        >
          <div className="border-b border-zinc-600/80 w-full" />
          <span className="text-nowrap">声调</span>
          <div className="border-b border-zinc-600/80 w-full" />
        </button>
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
              className={cn(
                pinYin === ""
                  ? "contrast-0 text-zinc-400/20"
                  : "text-zinc-600 hover:text-slate-600/80"
              )}
            />
          </button>
        </div>
      </div>
      <div className="px-1">
        <button
          className="w-full h-6 text-sm flex items-center gap-2 px-1 rounded-[2px] hover:bg-zinc-300/50 transition-colors duration-200 ease-in-out"
          onClick={() => setShowBreak(!showBreak)}
        >
          <div className="border-b border-zinc-600/80 w-full" />
          <span className="text-nowrap">停顿</span>
          <div className="border-b border-zinc-600/80 w-full" />
        </button>
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
                    Number(e.target.value) < 250
                      ? 250
                      : Number(e.target.value) > 5000
                      ? 5000
                      : Number(e.target.value)
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
                handleBreak(breakTime);
              }}
            >
              <IoIosCheckboxOutline
                size={30}
                className={cn("text-zinc-600 hover:text-slate-600/80")}
              />
            </button>
          </div>
          {Break.map((time) => (
            <button
              className="whitespace-normal inline-block border mt-1 mr-1 px-1 rounded-sm hover:bg-slate-400/50 transition-colors duration-200 text-sm"
              key={time}
              onClick={() => {
                handleBreak(time);
              }}
            >
              {time}ms
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolSidebar;
