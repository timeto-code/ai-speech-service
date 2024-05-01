"use client";

import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/store/useAudioStore";
import styles from "@/styles/AudioPlayer.module.scss";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PlaybackControls from "./PlaybackControls";
import VolumeControl from "./VolumeControl";

const AudioPlayer = () => {
  const isMounted = useMounted();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0.0);
  const [currentSeconds, setCurrentSeconds] = useState(0.0);
  const [duration, setDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");
  const progressRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef(0);

  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);

  const [src, setSrc] = useState("");

  const currentPlayingAudio = useAudioStore(
    (state) => state.currentPlayingAudio
  );

  const whilePlaying = useCallback(() => {
    if (audioRef.current) {
      setCurrentSeconds(audioRef.current.currentTime);
      setCurrentTime(
        moment.utc(audioRef.current.currentTime * 1000).format("mm:ss")
      );
    }
    animationRef.current = requestAnimationFrame(whilePlaying);
  }, []);

  // 检查是否有音频
  const checkAudio = () => {
    const src = useAudioStore.getState().currentPlayingAudio;
    return !!src;
  };

  // 播放/暂停
  const togglePlayPause = useCallback(() => {
    if (!checkAudio()) return;

    setIsPlaying((prev) => !prev);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        cancelAnimationFrame(animationRef.current);
      } else {
        audioRef.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      }
    }
  }, [isPlaying, whilePlaying]);

  // 重新播放
  const handleReplay = useCallback(() => {
    if (!checkAudio()) return;

    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
      // audioRef.current.currentTime = 0;
      // setCurrentTime(moment.utc(0 * 1000).format("mm:ss"));
      // setCurrentSeconds(0);
    }
  }, [whilePlaying]);

  // 拖动进度条
  const changeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkAudio()) return;

    const value = e.target.value as unknown as number;
    if (!value) return;
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(moment.utc(value * 1000).format("mm:ss"));
      setCurrentSeconds(value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkAudio()) return;

    const value = Number(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  // 静音
  const handleMute = () => {
    if (!checkAudio()) return;

    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  // 快进
  const handleForward = () => {
    if (!checkAudio()) return;

    if (audioRef.current) {
      audioRef.current.currentTime += 5;
    }
  };

  // 快退
  const handleBackward = () => {
    if (!checkAudio()) return;

    if (audioRef.current) {
      audioRef.current.currentTime -= 5;
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const seconds = audio.duration || 0;
    setSeconds(seconds);

    const formatStr = "mm:ss"; // 'HH:mm:ss'
    const duration = moment.utc(seconds * 1000).format(formatStr);

    setDuration(duration);

    if (progressRef.current) {
      progressRef.current.max = seconds.toString();
    }

    togglePlayPause();
  };

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(false);
    audio.pause();
    cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    handleEnded();
    if (currentPlayingAudio) {
      setSrc(currentPlayingAudio);
    }
  }, [currentPlayingAudio, handleEnded]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn("flex items-center px-1 w-full relative")}>
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div className="flex items-center">
        <PlaybackControls
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
          handleForward={handleForward}
          handleBackward={handleBackward}
        />
      </div>
      {/* 音量功能隐藏了，觉得没必要 */}
      <div className="w-20 hidden">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          handleVolumeChange={handleVolumeChange}
          handleMute={handleMute}
        />
      </div>
      {/* </div> */}
      <div className="flex-1 flex items-center px-2">
        <input
          ref={progressRef}
          type="range"
          className={`w-full ${styles.slider}`}
          style={{
            background: `linear-gradient(to right,  #999999 ${
              (currentSeconds / seconds) * 100
            }% 
          , #fff ${(currentSeconds / seconds) * 100}%)`,
          }}
          min={0.01}
          step={0.001}
          value={currentSeconds}
          onChange={changeRange}
        />
      </div>
      <div className="flex items-center justify-end w-[92px]">
        <span
          className="text-sm text-nowrap select-none"
          contentEditable={false}
        >
          {currentTime} / {duration}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
