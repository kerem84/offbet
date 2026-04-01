"use client";

import { useBets } from "@/features/bets/hooks/use-bets";
import { BetCard } from "@/features/bets/components/bet-card";

export default function FeedPage() {
  const { bets, loading } = useBets("active");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-pixel text-xs text-arcade-muted animate-pulse">
          YUKLENIYOR...
        </span>
      </div>
    );
  }

  if (bets.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-pixel text-lg text-arcade-yellow">AKTIF BAHISLER</h1>
        <div className="flex items-center justify-center py-20 border-2 border-dashed border-arcade-border">
          <span className="font-pixel text-[10px] text-arcade-muted">
            HENUZ BAHIS YOK — ILK BAHSI SEN ONER!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-lg text-arcade-yellow">AKTIF BAHISLER</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bets.map((bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
}
