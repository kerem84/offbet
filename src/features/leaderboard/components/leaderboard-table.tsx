"use client";

import Link from "next/link";
import { CoinCounter } from "@/components/ui/coin-counter";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { LeaderboardEntry } from "../types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

function getRankStyle(rank: number): string {
  if (rank === 1) return "text-arcade-yellow";
  if (rank === 2) return "text-arcade-muted";
  if (rank === 3) return "text-amber-600";
  return "text-arcade-muted";
}

function getRankBadge(rank: number): string {
  if (rank === 1) return " 👑";
  if (rank === 2) return " 🥈";
  if (rank === 3) return " 🥉";
  return "";
}

function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="border-2 border-arcade-border">
      {/* Header */}
      <div
        className="grid items-center px-3 py-2 border-b border-arcade-border bg-arcade-card"
        style={{ gridTemplateColumns: "60px 1fr 100px 80px 80px" }}
      >
        <span className="font-pixel text-[10px] text-arcade-muted">#</span>
        <span className="font-pixel text-[10px] text-arcade-muted">OYUNCU</span>
        <span className="font-pixel text-[10px] text-arcade-muted">PUAN</span>
        <span className="font-pixel text-[10px] text-arcade-muted">W</span>
        <span className="font-pixel text-[10px] text-arcade-muted">L</span>
      </div>

      {/* Rows */}
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`/profile/${entry.id}`}
          className="grid items-center px-3 py-3 border-b border-arcade-border hover:bg-arcade-card/50 transition-colors"
          style={{ gridTemplateColumns: "60px 1fr 100px 80px 80px" }}
        >
          {/* Rank */}
          <span className={`font-pixel text-[10px] ${getRankStyle(entry.rank)}`}>
            {entry.rank}{getRankBadge(entry.rank)}
          </span>

          {/* Username */}
          <div className="flex items-center gap-2 min-w-0">
            <UserAvatar
              avatarUrl={entry.avatar_url}
              username={entry.username}
              size="sm"
            />
            <span className="font-pixel text-xs text-arcade-text truncate">
              {entry.username}
            </span>
          </div>

          {/* Points */}
          <div>
            <CoinCounter amount={entry.points} size="sm" />
          </div>

          {/* Wins */}
          <span className="font-pixel text-[10px] text-arcade-green">
            {entry.total_wins}
          </span>

          {/* Losses */}
          <span className="font-pixel text-[10px] text-arcade-red">
            {entry.total_losses}
          </span>
        </Link>
      ))}

      {entries.length === 0 && (
        <div className="py-12 text-center">
          <span className="font-pixel text-[10px] text-arcade-muted">
            HENUZ KAYIT YOK
          </span>
        </div>
      )}
    </div>
  );
}

export { LeaderboardTable };
