"use client";

import Link from "next/link";
import { PixelCard } from "@/components/ui/pixel-card";
import { HpBar } from "@/components/ui/hp-bar";
import { Countdown } from "@/components/ui/countdown";
import { CoinCounter } from "@/components/ui/coin-counter";
import { calculateOdds } from "../utils";
import type { Bet } from "../types";

interface BetCardProps {
  bet: Bet;
}

function BetCard({ bet }: BetCardProps) {
  const { yesTotal, noTotal, pool } = calculateOdds(bet.wagers);
  const participantCount = new Set(bet.wagers.map((w) => w.user_id)).size;

  return (
    <Link href={`/bet/${bet.id}`} className="block">
      <PixelCard glowColor="#a855f7" className="flex flex-col gap-3 h-full">
        {/* Top row: category + countdown */}
        <div className="flex items-center justify-between">
          <span className="font-pixel text-[10px] text-arcade-purple uppercase">
            {bet.category}
          </span>
          <Countdown deadline={bet.deadline} />
        </div>

        {/* Title */}
        <p className="font-pixel text-xs leading-relaxed text-arcade-text">
          {bet.title}
        </p>

        {/* HP Bar */}
        <HpBar yesAmount={yesTotal} noAmount={noTotal} />

        {/* Bottom row: pool + participants */}
        <div className="flex items-center justify-between pt-1">
          <CoinCounter amount={pool} size="sm" />
          <span className="font-pixel text-[10px] text-arcade-muted">
            {participantCount} OYUNCU
          </span>
        </div>
      </PixelCard>
    </Link>
  );
}

export { BetCard };
