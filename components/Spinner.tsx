import React from "react";
import sytles from "@/styles/Spinner.module.scss";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div
      className={`w-10 h-10 border-[4px] border-gray-500/50 border-t-sky-500 rounded-full ${sytles.loader} ${className}`}
    />
  );
};

export default Spinner;
