"use client";

import { PixelCard } from "@/components/ui/pixel-card";
import { HpBar } from "@/components/ui/hp-bar";
import { Countdown } from "@/components/ui/countdown";
import { CoinCounter } from "@/components/ui/coin-counter";
import { WagerForm } from "./wager-form";
import { calculateOdds } from "../utils";
import { useAuth } from "@/components/providers";
import { ReactionBar } from "@/features/reactions/components/reaction-bar";
import { CommentList } from "@/features/reactions/components/comment-list";
import type { Bet } from "../types";

interface BetDetailProps {
  bet: Bet;
}

function BetDetail({ bet }: BetDetailProps) {
  const { profile } = useAuth();
  const { yesTotal, noTotal, pool } = calculateOdds(bet.wagers);
  const participantCount = new Set(bet.wagers.map((w) => w.user_id)).size;

  const isActive = bet.status === "active";
  const isResolved = bet.status === "resolved";

  const existingWager =
    profile
      ? (bet.wagers.find((w) => w.user_id === profile.id) ?? null)
      : null;

  return (
    <div className="flex flex-col gap-4">
    <PixelCard glowColor="#a855f7" className="space-y-5">
      {/* Category + status indicator */}
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[10px] text-arcade-purple uppercase">
          {bet.category}
        </span>
        {isActive && <Countdown deadline={bet.deadline} />}
        {isResolved && (
          <span className="font-pixel text-[10px] text-arcade-green">
            {bet.resolution === true ? "EVET KAZANDI" : bet.resolution === false ? "HAYIR KAZANDI" : "COZUMLENDI"}
          </span>
        )}
        {!isActive && !isResolved && (
          <span className="font-pixel text-[10px] text-arcade-muted uppercase">
            {bet.status}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-pixel text-sm leading-relaxed text-arcade-text">
        {bet.title}
      </h1>

      {/* Description */}
      {bet.description && (
        <p className="text-sm text-arcade-muted leading-relaxed">
          {bet.description}
        </p>
      )}

      {/* Creator */}
      <p className="font-pixel text-[10px] text-arcade-muted">
        OLUSTURAN:{" "}
        <span className="text-arcade-yellow">{bet.creator.username}</span>
      </p>

      {/* HP Bar */}
      <HpBar yesAmount={yesTotal} noAmount={noTotal} />

      {/* Pool + participants */}
      <div className="flex items-center justify-between">
        <CoinCounter amount={pool} size="md" />
        <span className="font-pixel text-[10px] text-arcade-muted">
          {participantCount} OYUNCU
        </span>
      </div>

      {/* Wager form — only when active */}
      {isActive && (
        <div className="border-t border-arcade-border pt-4">
          <WagerForm
            betId={bet.id}
            creatorId={bet.creator_id}
            minWager={bet.min_wager}
            maxWager={bet.max_wager}
            existingWager={
              existingWager
                ? { side: existingWager.side, amount: existingWager.amount }
                : null
            }
          />
        </div>
      )}
    </PixelCard>

    {/* Reactions */}
    <PixelCard glowColor="#facc15">
      <ReactionBar betId={bet.id} />
    </PixelCard>

    {/* Comments */}
    <PixelCard glowColor="#a855f7">
      <CommentList betId={bet.id} />
    </PixelCard>
    </div>
  );
}

export { BetDetail };
