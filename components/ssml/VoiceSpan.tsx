import { Voice } from "@prisma/client";
import React, { useEffect } from "react";

interface VoiceSpanProps {
  id: string;
  voice: Voice;
  content: string;
}

const VoiceSpan = ({ voice, content }: VoiceSpanProps) => {
  const [isEmpty, setIsEmpty] = React.useState(false);

  useEffect(() => {
    setIsEmpty(!!content);
  }, [content]);

  return (
    <>
      {isEmpty ? (
        ""
      ) : (
        <>
          <span className="text-sm text-sky-600">{`<${voice.LocalName}>`}</span>
          <span className="text-[#4A5568]" contentEditable>
            {content}
          </span>
          <span className="text-sm text-sky-600">{`</>`}</span>
        </>
      )}
    </>
  );
};

export default VoiceSpan;
