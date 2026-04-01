"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { useBets } from "@/features/bets/hooks/use-bets";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelCard } from "@/components/ui/pixel-card";
import { calculateOdds } from "@/features/bets/utils";

export default function AdminPage() {
  const { profile, loading: authLoading } = useAuth();
  const { bets: pendingBets, loading: pendingLoading, refetch: refetchPending } = useBets("pending");
  const { bets: activeBets, loading: activeLoading, refetch: refetchActive } = useBets("active");
  const [resolving, setResolving] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-pixel text-xs text-arcade-muted animate-pulse">YUKLENIYOR...</span>
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-pixel text-lg text-arcade-red tracking-widest">
          ERISIM ENGELLENDI
        </span>
      </div>
    );
  }

  async function handleApprove(betId: string) {
    setResolving(betId);
    const supabase = createClient();
    await supabase.from("bets").update({ status: "active" }).eq("id", betId);
    await refetchPending();
    setResolving(null);
  }

  async function handleReject(betId: string) {
    setResolving(betId);
    const supabase = createClient();
    await supabase.from("bets").update({ status: "cancelled" }).eq("id", betId);
    await refetchPending();
    setResolving(null);
  }

  async function handleResolve(betId: string, resolution: boolean) {
    setResolving(betId);
    await fetch("/api/resolve-bet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ betId, resolution }),
    });
    await refetchActive();
    setResolving(null);
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3 border-b-2 border-arcade-border pb-4">
        <h1 className="font-pixel text-lg text-arcade-yellow tracking-widest">ADMIN PANELI</h1>
        <span className="font-pixel text-[10px] text-arcade-muted border border-arcade-border px-2 py-0.5">
          {profile.username}
        </span>
      </div>

      {/* Section 1 — Pending Bets */}
      <section className="space-y-4">
        <h2 className="font-pixel text-sm text-arcade-muted tracking-widest">
          ONAY BEKLEYEN BAHISLER
          <span className="ml-2 text-arcade-yellow">({pendingBets.length})</span>
        </h2>

        {pendingLoading ? (
          <span className="font-pixel text-[10px] text-arcade-muted animate-pulse">YUKLENIYOR...</span>
        ) : pendingBets.length === 0 ? (
          <div className="flex items-center justify-center py-10 border-2 border-dashed border-arcade-border">
            <span className="font-pixel text-[10px] text-arcade-muted">BEKLEYEN BAHIS YOK</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBets.map((bet) => (
              <PixelCard key={bet.id} className="space-y-3">
                <div className="space-y-1">
                  <p className="font-pixel text-xs text-arcade-yellow truncate">{bet.title}</p>
                  <p className="font-pixel text-[10px] text-arcade-muted">
                    @{bet.creator.username}
                  </p>
                  {bet.description && (
                    <p className="font-pixel text-[10px] text-arcade-muted/70 line-clamp-2">
                      {bet.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <PixelButton
                    variant="yes"
                    size="sm"
                    disabled={resolving === bet.id}
                    onClick={() => handleApprove(bet.id)}
                  >
                    ONAYLA
                  </PixelButton>
                  <PixelButton
                    variant="danger"
                    size="sm"
                    disabled={resolving === bet.id}
                    onClick={() => handleReject(bet.id)}
                  >
                    REDDET
                  </PixelButton>
                </div>
              </PixelCard>
            ))}
          </div>
        )}
      </section>

      {/* Section 2 — Resolve Active Bets */}
      <section className="space-y-4">
        <h2 className="font-pixel text-sm text-arcade-muted tracking-widest">
          AKTIF BAHISLERI COZUMLE
          <span className="ml-2 text-arcade-yellow">({activeBets.length})</span>
        </h2>

        {activeLoading ? (
          <span className="font-pixel text-[10px] text-arcade-muted animate-pulse">YUKLENIYOR...</span>
        ) : activeBets.length === 0 ? (
          <div className="flex items-center justify-center py-10 border-2 border-dashed border-arcade-border">
            <span className="font-pixel text-[10px] text-arcade-muted">AKTIF BAHIS YOK</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBets.map((bet) => {
              const { pool } = calculateOdds(bet.wagers);
              const wagerCount = bet.wagers.length;
              const isResolving = resolving === bet.id;

              return (
                <PixelCard key={bet.id} className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-pixel text-xs text-arcade-yellow truncate">{bet.title}</p>
                    <div className="flex gap-4">
                      <span className="font-pixel text-[10px] text-arcade-muted">
                        {wagerCount} BAHIS
                      </span>
                      <span className="font-pixel text-[10px] text-arcade-green">
                        {pool} PUAN HAVUZ
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <PixelButton
                      variant="yes"
                      size="sm"
                      disabled={isResolving}
                      onClick={() => handleResolve(bet.id, true)}
                    >
                      EVET KAZANDI
                    </PixelButton>
                    <PixelButton
                      variant="no"
                      size="sm"
                      disabled={isResolving}
                      onClick={() => handleResolve(bet.id, false)}
                    >
                      HAYIR KAZANDI
                    </PixelButton>
                  </div>
                </PixelCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
