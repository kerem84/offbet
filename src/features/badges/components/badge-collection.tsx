"use client";

import { PixelCard } from "@/components/ui/pixel-card";
import { useBadges } from "../hooks/use-badges";
import { BadgeDisplay } from "./badge-display";

interface BadgeCollectionProps {
  userId: string;
}

export function BadgeCollection({ userId }: BadgeCollectionProps) {
  const { badges, loading } = useBadges(userId);

  return (
    <PixelCard>
      <p className="font-pixel text-[9px] text-arcade-yellow mb-3">ROZETLER</p>

      {loading ? (
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-arcade-border/30 animate-pulse mx-auto"
            />
          ))}
        </div>
      ) : badges.length === 0 ? (
        <p className="font-pixel text-[8px] text-arcade-muted text-center py-2">
          Henuz rozet kazanilmamis.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {badges.map((ub) => (
            <BadgeDisplay key={ub.id} badge={ub.badge} earned />
          ))}
        </div>
      )}
    </PixelCard>
  );
}
