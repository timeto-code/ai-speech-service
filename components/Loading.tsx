import React from "react";
import sytles from "@/styles/Spinner.module.scss";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className={`w-10 h-10 border-[4px] border-gray-500/50 border-t-sky-500 rounded-full ${sytles.loader}`}
      ></div>
    </div>
  );
};

export default Loading;
