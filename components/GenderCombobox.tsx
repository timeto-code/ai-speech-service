"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useVoiceStore } from "@/store/useVoiceStore";
import Combobox from "./Combobox";

const languages = [
  { label: "全部", value: "All" },
  { label: "男", value: "Male" },
  { label: "女", value: "Female" },
];

const GenderCombobox = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("All");

  useEffect(() => {
    useVoiceStore.setState({ gender: value });
  }, [value]);

  return (
    <Combobox
      options={languages}
      value={value}
      setValue={setValue}
      className="h-[114px] w-[240px] py-1 px-0"
    />
    // <Popover
    //   open={open}
    //   onOpenChange={() => {
    //     setOpen(!open);
    //   }}
    // >
    //   <PopoverTrigger asChild>
    //     <Button
    //       variant="outline"
    //       role="combobox"
    //       className={cn(
    //         "w-full justify-between h-8",
    //         !value && "text-muted-foreground"
    //       )}
    //     >
    //       {value
    //         ? languages.find((language) => language.value === value)?.label
    //         : "Select language"}
    //       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent className="w-[220px] p-1">
    //     <div className="w-full h-full flex flex-col gap-1">
    //       {languages.map((language) => (
    //         <button
    //           className="w-full rounded-sm flex items-center px-3 h-7 hover:bg-[#f4f4f5]"
    //           key={language.value}
    //           onClick={() => {
    //             setValue(language.value);
    //             setOpen(false);
    //           }}
    //         >
    //           <Check
    //             className={cn(
    //               "mr-2 h-4 w-4",
    //               language.value === value ? "opacity-100" : "opacity-0"
    //             )}
    //           />
    //           <span className="text-sm">{language.label}</span>
    //         </button>
    //       ))}
    //     </div>
    //   </PopoverContent>
    // </Popover>
  );
};

export default GenderCombobox;
