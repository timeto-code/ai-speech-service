"use client";

import { Button } from "@/components/ui/button";
import { Command } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface ComboboxProps {
  boxLabel: string;
  options: { value: string; label: string }[];
  value: string;
  setValue: (value: string) => void;
  isLoading: boolean;
  className?: string;
}

const Combobox = ({
  boxLabel,
  options,
  value,
  setValue,
  isLoading,
  className,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-full  flex items-center justify-between"
          variant="outline"
          disabled={isLoading}
        >
          <span
            className={cn(
              "text-nowrap truncate",
              boxLabel === "语言"
                ? "before:content-['语言_:_']"
                : "before:content-['性别_:_']"
            )}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select framework..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={(cn(""), className)}>
        <Command className="flex gap-1 h-full overflow-auto px-1">
          {options.map((option, i) => (
            <Button
              className="w-full hover:bg-zinc-300/50 rounded-sm h-8 flex items-center justify-start px-1 border-none"
              variant="outline"
              key={i}
              value={option.value}
              onClick={() => {
                setValue(option.value === value ? "" : option.value);
                setOpen(false);
              }}
              title={option.label}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === option.value ? "opacity-100" : "opacity-0"
                )}
              />
              <span className="text-sm truncate">{option.label}</span>
            </Button>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
