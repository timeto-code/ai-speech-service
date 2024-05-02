import { fetchLatestSpeech } from "@/actions/TTS";
import { useAudioStore } from "@/store/useAudioStore";
import {
  SsmlSection,
  useSsmlSectionsStore,
  useSsmlSynthesisStore,
} from "@/store/useSSMLStore";
import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import axios from "axios";
import logger from "./logger";

type DTO = {
  filename: string;
  language: string;
  sectionPreview: boolean;
  sections: SsmlSection[];
  voice: string;
};

export const speechSynthesis = async (
  sectionSynthesis: Boolean,
  section?: SsmlSection[]
) => {
  const setStatus = useTTS_SynthesisButton.getState().setStatus;
  setStatus("pending");

  // 段落转义时，必须传入段落对象
  if (sectionSynthesis && !section) {
    setStatus("error");
    return;
  }

  // 整体转义时，需要等待段落整合完成
  if (!sectionSynthesis) {
    useSsmlSynthesisStore.getState().setStarted();
    await delay(1000);
  }
  console.log("test");

  const data = {
    filename: "", // 文件名
    language: "", // SSML 语言
    sectionPreview: sectionSynthesis, // 是否是单个段落的 TTS 请求
    sections: sectionSynthesis
      ? section
      : useSsmlSectionsStore.getState().sections, // SSML 段落数组
    voice: useSsmlSectionsStore.getState().sections[0].voice?.ShortName || "", // 语音名称，SQLite 数据库操作使用
  } as DTO;

  // 发送 TTS 请求
  const res = await axios.post("/api/tts", data);

  // 请求成功，创建 EventSource
  if (res.status === 200) {
    const es = new EventSource("/api/tts");

    es.onmessage = async (event) => {
      const edata = event.data as EventSourceCode;
      setStatus(edata);
      es.close();
      if (edata === "finished") {
        const speech = await fetchLatestSpeech();
        if (speech) {
          useAudioStore.setState({ currentPlayingAudio: speech.speech_url });
          if (sectionSynthesis) {
            useSsmlSectionsStore.setState((state) => {
              return {
                sections: state.sections.map((s) => {
                  if (s.id === section![0].id) {
                    return {
                      ...s,
                      url: speech.speech_url,
                    };
                  }
                  return s;
                }),
              };
            });
          }
        }
      } else {
        console.log("Error:", event.data);
      }
    };

    es.onerror = (error) => {
      setStatus("error");
      console.error("EventSource failed:", error);
    };
  } else {
    setStatus("error");
    console.log("Error:", res.data);
  }
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
