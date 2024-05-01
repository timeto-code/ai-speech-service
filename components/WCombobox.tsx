"use client";

import React from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  setValue: (value: string) => void;
}

const WCombobox = ({ options, value, setValue }: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-[240px] relative">
      <Button
        className="w-full flex items-center justify-between px-4"
        variant="outline"
      >
        <span className="text-nowrap truncate">
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select framework..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <div className="z-50 absolute top-11 inset-x-0 bg-white border rounded p-1 flex flex-col gap-1 overflow-auto h-[calc(100vh-100px)]">
        {options.map((option, i) => (
          <button
            className=" hover:bg-zinc-300/50 rounded-sm h-8 flex items-center px-2"
            key={i}
            value={option.value}
            onClick={() => {
              setValue(option.value === value ? "" : option.value);
              setOpen(false);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value === option.value ? "opacity-100" : "opacity-0"
              )}
            />
            <span className="text-sm truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WCombobox;
