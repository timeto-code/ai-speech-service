import { fetchLatestSpeech } from "@/actions/api/tts";
import { ttsSynthesisReqDTO } from "@/dto";
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { SsmlSection, useSsmlSectionsStore, useSsmlSynthesisStore } from "@/store/useSSMLStore";
import { useTTS_SynthesisButton } from "@/store/useTTSStore";
import axios from "axios";
import { toast } from "sonner";
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

  // 检查是否有有效段落
  const sections = useSsmlSectionsStore.getState().sections;
  if (sections.length === 0) {
    return state.setStatusError();
  }

  // 检查所有段落的声音和内容是否都存在
  const hasInvalidSection = sections.some((s) => !s.voice || !s.htmlContent);
  if (hasInvalidSection) {
    toast("", {
      position: "bottom-left",
      description: "存在未选择声音或空段落。",
      style: { width: "auto" },
    });
    return state.setStatusError();
  }

  const data = {
    sectionPreview: sectionSynthesis, // 是否是单个段落的 TTS 请求
    sections: sectionSynthesis ? section : sections, // SSML 段落数组
  } as ttsSynthesisReqDTO;

  // 发送 TTS 请求
  const res = await axios.post("/api/tts", data);

  // 请求成功，创建 EventSource
  if (res.status === 200) {
    switch (res.data.code) {
      case 1: {
        // 提示无有效段落
        state.setStatusError();
        break;
      }

      case 2: {
        const sse = new EventSource(`/api/tts/ees?_=${new Date().getTime()}`);

        sse.onmessage = async (event) => {
          const sseData = event.data as ttsSynthesisStatusType;
          state.setStatus(sseData);
          sse.close();

          switch (sseData) {
            case "finished":
              const resSpeech = await fetchLatestSpeech();
              if (resSpeech.code === 0 && resSpeech.data) {
                const speech = resSpeech.data;
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
              } else {
                // 提示错误
                state.setStatusError();
              }
              break;

            case "terminated":
              // 提示手动取消成功
              break;

            default:
              // 其他提示
              break;
          }
        };

        sse.onerror = (error) => {
          // 提示错误
          state.setStatusError();
        };
        break;
      }

      default: {
        // 提示错误
        state.setStatusError();
        break;
      }
    }
  } else {
    // 提示错误
    state.setStatusError();
  }
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
