"use server";

import logger from "@/lib/logger";
import fs from "fs/promises";
import path from "path";

export const generateSSML = async (
  fileName: string,
  language: string,
  htmlContent: string
) => {
  logger.debug(`fileName: ${fileName}`);
  logger.debug(`language: ${language}`);

  const speechTemplateStart = `
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="zh-CN">
  <voice name="${language}">`;

  const speechTemplateEnd = `
  </voice>
</speak>`;

  // <span class="yu-qi" stylename="gentle" data-before="[温柔的" data-after="]">首意染色</span>
  // <mstts:express-as style="affectionate"></mstts:express-as>

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
    .replaceAll(`<span class="yu-qi" style-name="`, `<mstts:express-as style="`)
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
  // <span class="break" data-before="[" data-after="]">=1</span>
  // <break time="700ms" /><s />

  // <span class="sheng-diao" data-before="[" data-after="]">#yuan 2</span>
  // <phoneme alphabet="sapi" ph="cao 4">操</phoneme>

  content = speechTemplateStart + content + speechTemplateEnd;

  logger.debug(`htmlContent: ${content}`);

  // 创建xml文件
  const patss = process.cwd() + `/public/speech/temp/${fileName}.xml`;
  await fs.writeFile(patss, content);

  logger.debug(`SSML file created: ${patss}`);
  return `${fileName}`;
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
