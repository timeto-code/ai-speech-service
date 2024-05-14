import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 创建 span 元素
export const generateSpan = ({
  id,
  name,
  type,
  underline,
}: {
  id?: string;
  name?: string;
  type?: string;
  underline?: boolean;
}) => {
  const span = document.createElement("span");
  if (id) span.setAttribute("id", id);
  if (name) span.setAttribute("name", name);
  if (type) span.setAttribute("type", type);
  span.className = `select-none ${
    type === "mstts:express-as" || type === "lang" ? `` : `text-xs text-[#0078d4] font-bold`
  } ${underline ? "underline underline-offset-4 decoration-[#0078d4]" : ""}`;
  span.contentEditable = "false";

  return span;
};
