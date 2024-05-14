import { SsmlSection, XMLNode } from "@/store/useSSMLStore";
import jsdom from "jsdom";
import logger from "./logger";

const { JSDOM } = jsdom;

export const generateSSML = async (sections: SsmlSection[], xmlNodes: XMLNode[]) => {
  const ssmlXml = [] as string[];

  sections.forEach(async (section) => {
    const { id, voice, htmlContent } = section;

    if (!voice || !htmlContent) {
      return;
    }
    const speechTemplateStart = `<voice name="${voice.ShortName}">`;

    const speechTemplateEnd = `</voice>`;

    // 创建解析器和构建器
    const dom = new JSDOM(`<div>${htmlContent}</div>`);
    const document = dom.window.document;

    document.querySelectorAll("br").forEach((br) => {
      br.remove();
    });

    document.querySelectorAll("span").forEach((span) => {
      if (!span.getAttribute("type")) {
        span.remove();
      }
    });

    document.querySelectorAll("span").forEach((span) => {
      if (span.getAttribute("type") === "break") {
        const id = span.getAttribute("id");
        const node = xmlNodes.find((node) => node.id === id)?.node;
        if (node) {
          span.replaceWith(node);
        }
      }
    });

    document.querySelectorAll("span").forEach((span) => {
      if (span.getAttribute("type") === "phoneme") {
        const id = span.getAttribute("id");
        const node = xmlNodes.find((node) => node.id === id)?.node;
        if (node) {
          span.replaceWith(node);
        }
      }
    });

    document.querySelectorAll("span").forEach((node) => {
      if (node.getAttribute("type") === "lang") {
        // 创建新的 pph 元素
        const newElement = document.createElement("lang");
        // 复制原始元素的所有属性
        Array.from(node.attributes).forEach((attr) => {
          newElement.setAttribute(attr.name, attr.value);
        });

        // 将原 span 元素的所有子节点复制到新的 pph 元素中
        while (node.firstChild) {
          newElement.appendChild(node.firstChild);
        }

        // 替换 span 元素为 pph 元素
        node.replaceWith(newElement);

        // 移除不需要的属性
        newElement.removeAttribute("name");
        newElement.removeAttribute("type");
        newElement.removeAttribute("class");
        newElement.removeAttribute("contenteditable");
      }
    });

    document.querySelectorAll("span").forEach((node) => {
      if (node.getAttribute("type") === "mstts:express-as") {
        // 创建新的 pph 元素
        const newElement = document.createElement("mstts:express-as");
        // 复制原始元素的所有属性
        Array.from(node.attributes).forEach((attr) => {
          newElement.setAttribute(attr.name, attr.value);
        });

        // 将原 span 元素的所有子节点复制到新的 pph 元素中
        while (node.firstChild) {
          newElement.appendChild(node.firstChild);
        }

        // 替换 span 元素为 pph 元素
        node.replaceWith(newElement);

        // 移除不需要的属性
        newElement.removeAttribute("name");
        newElement.removeAttribute("type");
        newElement.removeAttribute("class");
        newElement.removeAttribute("contenteditable");
      }
    });

    const resultString = document
      .querySelector("div")!
      .outerHTML.replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("<div>", "")
      .replaceAll("</div>", "")
      .replaceAll("&nbsp;", " ")
      .replaceAll("<mstts:express-as", "<s/><mstts:express-as")
      .replaceAll("</mstts:express-as>", "</mstts:express-as><s/>");

    const xmlStr = removeCharBeforeSpecialChar(resultString, "<phoneme");

    logger.debug(xmlStr);

    ssmlXml.push(speechTemplateStart + xmlStr + speechTemplateEnd);
    // const xmlStr = `<voice name="zh-CN-XiaoxiaoNeural">女孩生气的对男孩说：<s/><mstts:express-as style="angry">我生气了，你别惹我，你再惹我我打你。</mstts:express-as><s/>男孩反而笑着说：<s/><mstts:express-as style="cheerful">哈哈哈，我就喜欢你打我。</mstts:express-as><s/></voice>`;

    // ssmlXml.push(xmlStr);
  });

  return ssmlXml.join("");
};

function removeCharBeforeSpecialChar(str: string, specialChar: string) {
  // 使用正则表达式来查找特殊字符前的一个字符
  const regex = new RegExp(`(.?)${specialChar}`, "g");

  // 使用replace方法进行替换
  return str.replace(regex, (match, p1, offset, string) => {
    // 如果前面的字符存在，则移除它
    return specialChar;
  });
}
