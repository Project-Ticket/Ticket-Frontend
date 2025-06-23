"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function TagsInput({
  initialTags,
  placeholder = "Tambah tag...",
  maxTags = 5,
  onTagsChange,
  className,
  disabled = false,
  name = "tags",
  showHint = true,
}: {
  initialTags: string[];
  placeholder?: string;
  maxTags?: number;
  onTagsChange?: (tags: string[]) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  showHint?: boolean;
}) {
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   onTagsChange?.(tags);
  // }, [tags, onTagsChange]);

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      const newTags = [...tags, trimmedTag];
      onTagsChange?.(newTags);
      setTags(newTags);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onTagsChange?.(newTags);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={cn(`w-full relative`, className)}>
      {disabled && (
        <div className="h-9 rounded-md dark:bg-input/30 bg-background border border-input absolute z-30 w-full"></div>
      )}
      <div
        onClick={handleContainerClick}
        className={`
          relative z-0
              min-h-9 w-full rounded-md border border-input px-3 py-2
              text-sm ring-offset-background placeholder:text-muted-foreground 
              focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 
              cursor-text dark:bg-input/30 bg-transparent
              ${isInputFocused ? "ring-2 ring-ring ring-offset-2" : ""}
            `}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md dark:bg-background bg-gray-200 text-background-foreground text-xs font-medium dark:hover:bg-background/80 transition-colors hover:bg-gray-300"
            >
              {tag}
              <Button
                variant={"ghost"}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-background-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          {tags.length < maxTags && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={tags.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground pt-1"
            />
          )}
          <input type="hidden" value={JSON.stringify(tags)} name="tags" />
        </div>
      </div>
      {showHint && (
        <div className="text-xs text-destructive">* Enter for add new tag</div>
      )}
    </div>
  );
}
