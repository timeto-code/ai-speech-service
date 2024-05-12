import { createSpeech } from "@/actions/prisma/speech";
import { responseCodeMessageMap, ttsSynthesisReqDTO, ttsSynthesisResDTO } from "@/dto";
import { chapterDir, sectionDir } from "@/util/config";
import logger from "@/util/logger";
import { generateSSML } from "@/util/ssml";
import { ttsSynthesisStatus, ttsSynthesisStatusType } from "@/util/state";
import axios from "axios";
import fs from "fs/promises";
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { NextRequest, NextResponse } from "next/server";
import { log } from "winston";

// 更新 SSE 状态
const updateStatus = async (status: ttsSynthesisStatusType) => {
  return await axios.get(`http://localhost:3007/api/tts/sse/status/${status}`);
};

// 微软语音合成
const ttsSynthesis = async (data: ttsSynthesisReqDTO) => {
  const { sectionPreview, sections, xmlNodes } = data;

  // 生成文件路径
  const filename = `tts-${new Date().getTime()}`;
  const dir = sectionPreview ? `${sectionDir}${filename}` : `${chapterDir}${filename}`;
  const xmlDir = `${dir}.xml`; // SSML 文件路径
  const wavDir = `${dir}.wav`; // 音频文件路径

  // 初始化 SSML 文件结构件，将第一个段落的语言设置为 SSML 的语言
  const langCodeSplit = sections[0].voice!.Locale.split("-");
  const lang = langCodeSplit[0] + "-" + langCodeSplit[1].toUpperCase();
  const xmlSstart = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="${lang}">`;
  const xmlEnd = `</speak>`;

  // 生成、合并段落
  const xmlContent = await generateSSML(sections, xmlNodes);

  logger.debug(`SSML: ${xmlContent}`);

  // return { wavDir: "", filename: "" };

  // 拼接 SSML 文件
  const ssmlXml = `${xmlSstart}${xmlContent}${xmlEnd}`;

  let xml;
  try {
    // 保存并读取 SSML 文件
    await fs.writeFile(xmlDir, ssmlXml);
    xml = await fs.readFile(xmlDir, "utf8");
  } catch (error) {
    throw error;
  }

  /**
   * 初始化 Microsoft Speech SDK 语音合成器
   * 合成中断、完成、错误时，设置 nodejs 全局状态
   * 合成完成后，保存语音和 SSML 文件到数据库
   */
  const speechConfig = SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY!,
    process.env.SPEECH_REGION!
  );
  const audioConfig = AudioConfig.fromAudioFileOutput(wavDir);
  /** 创建语音合成器 */
  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

  // 更新 SSE 状态为 pending
  try {
    await updateStatus("pending");
  } catch (error) {
    throw error;
  }

  /** 执行语音合成 */
  synthesizer.speakSsmlAsync(
    xml,
    async function (result) {
      if (result.reason === ResultReason.SynthesizingAudioCompleted) {
        synthesizer.close();
        try {
          /** 保存 wav、xml 文件路径到数据库 */
          await createSpeech(filename, sections[0].voice!.ShortName, sectionPreview);
          await updateStatus("finished");
        } catch (error) {
          try {
            await updateStatus("error");
            logger.error(`Speech synthesis db error: ${error}`);
          } catch (error) {
            throw error;
          }
        }
      } else {
        try {
          await updateStatus("canceled");
          logger.error(`Speech synthesis canceled, ${result.errorDetails}`);
        } catch (error) {
          throw error;
        }
      }
    },
    async function (error) {
      try {
        synthesizer.close();
        await updateStatus("error");
        logger.error(`Speech synthesis error: ${error}`);
      } catch (error) {
        throw error;
      }
    }
  );

  return { wavDir, filename };
};

// 发送响应
const sendResponse = (res: ttsSynthesisResDTO) => {
  res.message = responseCodeMessageMap[res.code];
  return NextResponse.json({ ...res }, { status: 200 });
};

/**
 * 发送 POST 请求，开始语音合成
 */
export async function POST(request: NextRequest) {
  try {
    let { sectionPreview, sections, xmlNodes } = (await request.json()) as ttsSynthesisReqDTO;

    // 无有效段落时返回错误
    if (sections.length === 0) return sendResponse({ code: 1 });

    // 语音合成开始
    const { wavDir, filename } = await ttsSynthesis({ sectionPreview, sections, xmlNodes });

    logger.debug(`${responseCodeMessageMap[2]}: ${wavDir}`);
    return sendResponse({ code: 2, data: filename });
  } catch (error) {
    logger.error(`${responseCodeMessageMap[3]}: ${error}`);
    return sendResponse({ code: 3 });
  }
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");

  // 取消语音合成
  if (action === "CancelSynthesis") {
    try {
      await updateStatus("terminated");
      return sendResponse({ code: 0 });
    } catch (error) {
      logger.error(`${responseCodeMessageMap[11]}: ${error}`);
      return sendResponse({ code: 11 });
    }
  }
}
