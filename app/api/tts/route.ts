import { responseCodeMessageMap, ttsSynthesisReqDTO, ttsSynthesisResDTO } from "@/dto";
import logger, { root_dir } from "@/lib/logger";
import { saveSpeechAndXml } from "@/lib/speech";
import { generateSSML } from "@/lib/ssml";
import { ttsSynthesisStatus } from "@/lib/state";
import fs from "fs/promises";
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { NextRequest, NextResponse } from "next/server";

// 微软语音合成
const ttsSynthesis = async (data: ttsSynthesisReqDTO) => {
  const { sectionPreview, sections } = data;

  // 生成文件路径
  const filename = `tts-${new Date().getTime()}`;
  const dir = sectionPreview
    ? `${root_dir}/public/speech/section/${filename}`
    : `${root_dir}/public/speech/chapter/${filename}`;
  const xmlDir = `${dir}.xml`; // SSML 文件路径
  const wavDir = `${dir}.wav`; // 音频文件路径

  // 初始化 SSML 文件结构件，将第一个段落的语言设置为 SSML 的语言
  const langCodeSplit = sections[0].voice!.Locale.split("-");
  const lang = langCodeSplit[0] + "-" + langCodeSplit[1].toUpperCase();
  const xmlSstart = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="${lang}">`;
  const xmlEnd = `</speak>`;

  // 生成、合并段落
  const xmlContent = await generateSSML(sections);

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
  /** 执行语音合成 */
  ttsSynthesisStatus.start();
  synthesizer.speakSsmlAsync(
    xml,
    async function (result) {
      if (result.reason === ResultReason.SynthesizingAudioCompleted) {
        synthesizer.close();
        try {
          /** 保存 wav、xml 文件路径到数据库 */
          await saveSpeechAndXml(filename, sections[0].voice!.ShortName, sectionPreview);
          ttsSynthesisStatus.finished();
        } catch (error) {
          ttsSynthesisStatus.error();
          logger.error(`Speech synthesis db error: ${error}`);
        }
      } else {
        ttsSynthesisStatus.canceled();
        logger.error(`Speech synthesis canceled, ${result.errorDetails}`);
      }
    },
    function (error) {
      synthesizer.close();
      ttsSynthesisStatus.error();
      logger.error(`Speech synthesis error: ${error}`);
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
    let { sectionPreview, sections } = (await request.json()) as ttsSynthesisReqDTO;

    // 无有效段落时返回错误
    if (sections.length === 0) return sendResponse({ code: 1 });

    // 语音合成开始
    const { wavDir, filename } = await ttsSynthesis({ sectionPreview, sections });

    logger.debug(`Speech synthesis start: ${wavDir}`);
    return sendResponse({ code: 2, data: filename });
  } catch (error) {
    logger.error(`Internal Server Error: ${error}`);
    return sendResponse({ code: 3 });
  }
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");

  if (action === "CancelSynthesis") {
    ttsSynthesisStatus.terminated();
    return NextResponse.json({ code: 2 });
  }
}
