"use client";

import { use } from "react";
import { useBet } from "@/features/bets/hooks/use-bet";
import { BetDetail } from "@/features/bets/components/bet-detail";

interface BetPageProps {
  params: Promise<{ id: string }>;
}

export default function BetPage({ params }: BetPageProps) {
  const { id } = use(params);
  const { bet, loading } = useBet(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-pixel text-xs text-arcade-muted animate-pulse">
          YUKLENIYOR...
        </span>
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="flex items-center justify-center py-20 border-2 border-dashed border-arcade-border">
        <span className="font-pixel text-[10px] text-arcade-red">
          BAHIS BULUNAMADI
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BetDetail bet={bet} />
    </div>
  );
}
