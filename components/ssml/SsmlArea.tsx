"use client";

import { SsmlSection, useSSMLStore, useSsmlSectionsStore } from "@/store/useSSMLStore";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "../../styles/SsmlArea.css";
import { Button } from "../ui/button";
import DivEditor from "./DivEditor";
import { cn } from "@/lib/utils";
import XmlEditor from "./XmlEditor";

const SsmlArea = () => {
  const voice = useVoiceStore((state) => state.voice);
  const voiceRefreshed = useVoiceStore((state) => state.voiceRefreshed);
  const sections = useSsmlSectionsStore((state) => state.sections);
  // 设置滚动条和内容的间隙
  const scrollDiv = useRef<HTMLDivElement>(null);
  const [isScrollBarVisible, setIsScrollBarVisible] = useState(false);
  const [newSectionAction, setNewSectionAction] = useState(0);

  // 新建一个声音段落
  const handleNewSection = () => {
    const currentSections = useSsmlSectionsStore.getState().sections;
    const newSections = {
      id: new Date().getTime(),
      voice: null,
      htmlContent: "",
    } as SsmlSection;

    useSsmlSectionsStore.setState({
      sections: [...currentSections, newSections],
    });

    // 设置滚动条和内容的间距
    setNewSectionAction(new Date().getTime());
  };

  // 删除一个声音段落
  const handleDeleteSection = (id: number) => {
    const currentSections = useSsmlSectionsStore.getState().sections;
    const newSections = currentSections.filter((section) => section.id !== id);

    useSsmlSectionsStore.setState({
      sections: newSections,
    });

    // 设置滚动条和内容的间距
    setNewSectionAction(new Date().getTime());
  };

  // 点击声音列表时，更新当前聚焦段落的声音
  useEffect(() => {
    if (voice) {
      const currentVoceSection = useSSMLStore.getState().currentVoceSection;

      useSsmlSectionsStore.setState((state) => {
        return {
          sections: state.sections.map((section) => {
            if (section.id === currentVoceSection.id) {
              return {
                ...section,
                voice: voice,
              };
            }
            return section;
          }),
        };
      });
    }
  }, [voice, voiceRefreshed]);

  // 设置滚动条和内容的间距
  useEffect(() => {
    if (!scrollDiv.current) return;
    setIsScrollBarVisible(scrollDiv.current.scrollHeight > scrollDiv.current.clientHeight);
  }, [newSectionAction]);

  return (
    <div
      ref={scrollDiv}
      className={cn("h-full overflow-auto flex flex-col gap-3", isScrollBarVisible ? "pr-1" : "")}
    >
      {sections.map((section) => (
        <DivEditor key={section.id} section={section} handleDeleteSection={handleDeleteSection} />
      ))}
      <XmlEditor section={sections[0]} handleDeleteSection={handleDeleteSection} />
      <div>
        <Button
          variant="outline"
          onClick={handleNewSection}
          className="select-none"
          contentEditable={false}
        >
          <Plus className="w-4 h-4" />
          <span className="ml-1">新建段落</span>
        </Button>
      </div>
    </div>
  );
};

export default SsmlArea;
