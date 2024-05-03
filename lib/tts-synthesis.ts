import { fetchLatestSpeech } from "@/actions/api/tts";
import { ttsSynthesisReqDTO } from "@/dto";
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { SsmlSection, useSsmlSectionsStore, useSsmlSynthesisStore } from "@/store/useSSMLStore";
import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import axios from "axios";
import { ttsSynthesisStatusType } from "../util/state";

export const speechSynthesis = async (sectionSynthesis: Boolean, section?: SsmlSection[]) => {
  const state = useTTS_SynthesisButton.getState();
  state.setStatusPending();

  // 段落转义时，必须传入段落对象
  if (sectionSynthesis && !section) {
    return state.setStatusError();
  }

  // 整体转义时，需要等待段落整合完成
  if (!sectionSynthesis) {
    useSsmlSynthesisStore.getState().setStarted();
    await delay(1000);
  }

  const data = {
    sectionPreview: sectionSynthesis, // 是否是单个段落的 TTS 请求
    sections: sectionSynthesis ? section : useSsmlSectionsStore.getState().sections, // SSML 段落数组
  } as ttsSynthesisReqDTO;

  // 发送 TTS 请求
  const res = await axios.post("/api/tts", data);

  // 请求成功，创建 EventSource
  if (res.status === 200) {
    console.log("res.data", res.data);

    const sse = new EventSource(`/api/tts/ees?_=${new Date().getTime()}`);

    sse.onmessage = async (event) => {
      const sseData = event.data as ttsSynthesisStatusType;
      state.setStatus(sseData);
      sse.close();

      switch (sseData) {
        case "finished":
          const speech = await fetchLatestSpeech();
          if (speech) {
            useAudioPlayerStore.setState({ src: speech.speech_url });
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
          break;

        case "terminated":
          break;

        default:
          console.log("Error:", event.data);
          break;
      }
    };

    sse.onerror = (error) => {
      state.setStatusError();
      console.error("EventSource failed:", error);
    };
  } else {
    state.setStatusError();
    console.log("Error:", res.data);
  }
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
