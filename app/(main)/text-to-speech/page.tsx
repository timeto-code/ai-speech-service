import AudioPlayer from "@/components/audio-player/AudioPlayer";
import SsmlArea from "@/components/ssml/SsmlArea";
import CancelButton from "@/components/text-to-speech/CancelButton";
import OpenSpeechDir from "@/components/text-to-speech/OpenSpeechDir";
import SpeechButton from "@/components/text-to-speech/SpeechButton";
import VoiceConfig from "@/components/text-to-speech/VoiceConfig";

const page = () => {
  return (
    <div className="h-full w-full overflow-auto">
      <div className="h-full flex max-w-[1024px] min-w-[768px] p-3 mx-auto">
        <div className="h-full mr-3 flex flex-col flex-1 relative">
          <div
            className="flex items-center flex-col md:flex-row gap-2 select-none w-full"
            contentEditable={false}
          >
            <div className="flex w-full h-full items-center justify-between md:w-[156px]">
              <div className="flex  h-full gap-2">
                <OpenSpeechDir />
                <SpeechButton />
              </div>
              <div className="md:hidden h-full">
                <CancelButton />
              </div>
            </div>
            <div className="flex items-center bg-zinc-500/20 rounded-sm pr-2 py-2 pl-3 w-full h-full">
              <div className="flex items-center h-full w-full">
                <AudioPlayer />
              </div>
            </div>
            <div className="hidden md:block h-full w-16">
              <CancelButton />
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
