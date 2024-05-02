import logger from "@/lib/logger";
import { saveSpeechAndXml } from "@/lib/speech";
import { getState, setState } from "@/lib/state";
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { generateSSML } from "@/lib/ssml";

const response = (message: string, fileName: string, status: number) => {
  return NextResponse.json({ message, fileName }, { status });
};

export async function POST(request: NextRequest) {
  try {
    let { filename, language, sectionPreview, sections, voice } =
      await request.json();

    const speechTemplateStart = `
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="zh-CN">`;

    const speechTemplateEnd = `</speak>`;

    const sectionXmls = await generateSSML(sections);

    const ssmlXml = speechTemplateStart + sectionXmls + speechTemplateEnd;

    filename = filename || `tts-${new Date().getTime()}`;

    const rootPath = process.cwd();
    const dir = sectionPreview ? "/public/speech/temp/" : "/public/speech/";
    // 创建xml文件
    const patss = `${rootPath}${dir}${filename}.xml`;
    await fs.writeFile(patss, ssmlXml);

    // 开始语音转录
    const audioFile = `${rootPath}${dir}${filename}.wav`;

    const speechConfig = SpeechConfig.fromSubscription(
      process.env.SPEECH_KEY!,
      process.env.SPEECH_REGION!
    );
    const audioConfig = AudioConfig.fromAudioFileOutput(audioFile);

    // Create the speech synthesizer.
    let synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    // 文本保存到本地
    // 转换文本到语音，保存到本地
    const xmlPath = `${process.cwd()}${dir}${filename}.xml`;
    const xml = await fs.readFile(xmlPath, "utf8");

    synthesizer.speakSsmlAsync(
      xml,
      async function (result) {
        if (result.reason === ResultReason.SynthesizingAudioCompleted) {
          logger.debug("synthesis finished.");
          await saveSpeechAndXml(filename, voice, sectionPreview);
          setState("SpeechSynthesis", "finished");
        } else {
          setState("SpeechSynthesis", "canceled");
          logger.error(
            `Speech synthesis canceled, ${result.errorDetails} Did you set the speech resource key and region values?`
          );
        }
        synthesizer.close();
        // synthesizer = null;
      },
      function (err) {
        setState("SpeechSynthesis", "error");
        // console.trace("err - " + err);
        logger.error(`Error: ${err}`);
        synthesizer.close();
        // synthesizer = null;
      }
    );
    logger.debug(`Now synthesizing to: ${audioFile}`);
    setState("SpeechSynthesis", "started");
    return response("synthesizing", filename, 200);
  } catch (error) {
    logger.error(`Error: ${error}`);
    return response("Internal Server Error", "", 500);
  }
}

export async function GET() {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // 循环检查状态
  const interval = setInterval(() => {
    const state = getState("SpeechSynthesis");
    if (state === "finished" || state === "canceled" || state === "error") {
      clearInterval(interval);
      const message: EventSourceCode = state;
      writer.write(encoder.encode(`data: ${message}\n\n`));
    }
  }, 1000);

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
