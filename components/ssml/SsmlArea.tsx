"use client";

import {
  SsmlSection,
  useSSMLStore,
  useSsmlSectionsStore,
} from "@/store/useSSMLStore";
import { useVoiceStore } from "@/store/useVoiceStore";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import "../../styles/SsmlArea.css";
import { Button } from "../ui/button";
import DivEditor from "./DivEditor";

const SsmlArea = () => {
  const voice = useVoiceStore((state) => state.voice);

  const sections = useSsmlSectionsStore((state) => state.sections);

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
  };

  // 删除一个声音段落
  const handleDeleteSection = (id: number) => {
    const currentSections = useSsmlSectionsStore.getState().sections;
    const newSections = currentSections.filter((section) => section.id !== id);

    useSsmlSectionsStore.setState({
      sections: newSections,
    });
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
  }, [voice]);

  return (
    <div className="h-full overflow-auto pr-1 flex flex-col gap-3">
      {sections.map((section) => (
        <DivEditor
          key={section.id}
          section={section}
          handleDeleteSection={handleDeleteSection}
        />
      ))}
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
