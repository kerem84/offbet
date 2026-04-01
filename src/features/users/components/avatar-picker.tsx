"use client";

import { AVATARS } from "@/lib/constants";

interface AvatarPickerProps {
  selected: string | null;
  onSelect: (url: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {AVATARS.map((url, index) => {
        const isSelected = selected === url;
        return (
          <button
            key={url}
            type="button"
            onClick={() => onSelect(url)}
            className={[
              "w-12 h-12 border-2 flex items-center justify-center",
              "font-pixel text-[10px] transition-all",
              isSelected
                ? "border-arcade-yellow bg-arcade-yellow/10 text-arcade-yellow"
                : "border-arcade-border bg-arcade-card text-arcade-muted hover:border-arcade-muted",
            ].join(" ")}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
