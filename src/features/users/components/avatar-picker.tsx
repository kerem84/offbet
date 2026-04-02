"use client";

import { AVATAR_OPTIONS } from "@/lib/constants";
import { UserAvatar } from "@/components/ui/user-avatar";

interface AvatarPickerProps {
  selected: string | null;
  onSelect: (avatarId: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {AVATAR_OPTIONS.map((avatar) => {
        const isSelected = selected === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className={[
              "p-1 border-2 transition-all flex flex-col items-center gap-1",
              isSelected
                ? "border-arcade-yellow bg-arcade-yellow/10"
                : "border-arcade-border hover:border-arcade-muted",
            ].join(" ")}
          >
            <UserAvatar avatarUrl={avatar.id} username={avatar.label} size="md" />
            <span className="font-pixel text-[7px] text-arcade-muted truncate w-full text-center">
              {avatar.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
