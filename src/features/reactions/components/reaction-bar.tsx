"use client";

import { useAuth } from "@/components/providers";
import { REACTION_EMOJIS } from "@/lib/constants";
import { useReactions } from "../hooks/use-reactions";

interface ReactionBarProps {
  betId: string;
}

export function ReactionBar({ betId }: ReactionBarProps) {
  const { profile } = useAuth();
  const { reactions, toggleReaction } = useReactions(betId);

  function getCount(emoji: string) {
    return reactions.filter((r) => r.emoji === emoji).length;
  }

  function hasReacted(emoji: string) {
    if (!profile) return false;
    return reactions.some((r) => r.emoji === emoji && r.user_id === profile.id);
  }

  function handleClick(emoji: string) {
    if (!profile) return;
    toggleReaction(emoji, profile.id);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_EMOJIS.map((emoji) => {
        const count = getCount(emoji);
        const active = hasReacted(emoji);
        return (
          <button
            key={emoji}
            onClick={() => handleClick(emoji)}
            disabled={!profile}
            className={[
              "flex items-center gap-1 px-2 py-1 border-2 transition-all",
              "font-pixel text-[11px] disabled:opacity-40 disabled:cursor-not-allowed",
              "hover:scale-110 active:scale-95",
              active
                ? "border-arcade-yellow bg-arcade-yellow/10 text-arcade-yellow"
                : "border-arcade-border bg-transparent text-arcade-muted hover:border-arcade-muted",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="text-base leading-none">{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
