import { SsmlSection } from "@/store/useSSMLStore";

export const generateSSML = async (sections: SsmlSection[]) => {
  const ssmlXml = [] as string[];

  sections.forEach((section) => {
    const { id, voice, htmlContent } = section;

    if (!voice || !htmlContent) {
      return;
    }
    const speechTemplateStart = `<voice name="${voice.ShortName}">`;

    const speechTemplateEnd = `</voice>`;

    let content = htmlContent
      .replaceAll("<div>", "")
      .replaceAll("</div>", "")
      .replaceAll("<br>", "")
      .replaceAll(
        `<span class="break" data-before="[" data-after="]">=`,
        `<break time="`
      )
      .replaceAll(`ms</span>`, `ms" />`)
      .replaceAll(
        `<span class="sheng-diao" data-before="[" data-after="]">#`,
        `<phoneme alphabet="sapi" ph="`
      )
      .replaceAll(`声</span>`, `"></phoneme>`)
      .replaceAll(
        `<span class="yu-qi" style-name="`,
        `<mstts:express-as style="`
      )
      .replaceAll(`</span>`, `</mstts:express-as>`);

    content = adjustPhonemeTag(content);

    content = removeSpecialAttributes(content);

    content = content
      // .replaceAll(`<phoneme`, `<s /><phoneme`)
      // .replaceAll(`</phoneme>`, `</phoneme><s />`)
      .replaceAll(`<mstts:express-as`, `<s /><mstts:express-as`)
      .replaceAll(`</mstts:express-as>`, `</mstts:express-as><s />`)
      .replaceAll(`<s /><s />`, `<s />`)
      .replaceAll(`"  >`, `">`);
    // .replaceAll(`，`, `<s />`);
    ssmlXml.push(speechTemplateStart + content + speechTemplateEnd);
  });

  return ssmlXml.join("");
};

function adjustPhonemeTag(inputString: string) {
  // 正则表达式匹配<phoneme>前的任何单个字符，并捕获<phoneme>标签
  const regex = /(.)(<phoneme[^>]*>)/g;

  // 替换函数，将捕获的字符移动到<phoneme>标签中间
  return inputString.replace(regex, (match, charBefore, phonemeTag) => {
    // 将前一个字符插入到<phoneme>标签中
    return phonemeTag.replace(">", ">" + charBefore);
  });
}

function removeSpecialAttributes(text: string) {
  // 正则表达式用于匹配 data-before="[任意文本"
  const beforeRegex = /data-before="\[[^"]*"/g;
  // 正则表达式用于匹配 data-after="]"
  const afterRegex = /data-after="\]"/g;

  // 使用 replace 方法和正则表达式将匹配的文本替换为空
  return text.replace(beforeRegex, "").replace(afterRegex, "");
}
