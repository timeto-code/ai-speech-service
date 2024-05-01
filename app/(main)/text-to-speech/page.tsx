import AudioPlayer from "@/components/audio-player/AudioPlayer";
import SsmlArea from "@/components/ssml/SsmlArea";
import OpenSpeechDir from "@/components/text-to-speech/OpenSpeechDir";
import SpeechButton from "@/components/text-to-speech/SpeechButton";
import VoiceConfig from "@/components/text-to-speech/VoiceConfig";

const page = () => {
  return (
    <div className="h-full w-full overflow-auto">
      <div className="h-full flex max-w-[1024px] min-w-[720px] p-3 mx-auto">
        <div className="h-full mr-3 flex flex-col flex-1 relative">
          <div
            className="flex items-center gap-2 select-none"
            contentEditable={false}
          >
            <OpenSpeechDir />
            <SpeechButton />
            <div className="flex items-center bg-zinc-500/20 rounded-sm pr-2 py-2 pl-3 flex-1">
              <div className="flex-1 flex items-center h-full">
                <AudioPlayer />
              </div>
            </div>
          </div>
          <div className="h-full overflow-hidden pt-3">
            <SsmlArea />
          </div>
        </div>
        <div className="w-72 select-none" contentEditable={false}>
          <VoiceConfig />
        </div>
      </div>
    </div>
  );
};

export default page;
