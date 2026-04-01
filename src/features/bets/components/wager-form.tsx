"use client";

import { useState } from "react";
import { PixelButton } from "@/components/ui/pixel-button";
import { useWager } from "../hooks/use-wager";
import { useAuth } from "@/components/providers";

interface WagerFormProps {
  betId: string;
  creatorId: string;
  minWager: number;
  maxWager: number;
  existingWager?: {
    side: boolean;
    amount: number;
  } | null;
}

function WagerForm({ betId, creatorId, minWager, maxWager, existingWager }: WagerFormProps) {
  const { profile } = useAuth();
  const { placeWager } = useWager();

  const [side, setSide] = useState<boolean | null>(null);
  const effectiveMax = profile ? Math.min(maxWager, profile.points) : minWager;
  const [amount, setAmount] = useState(minWager);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Creator cannot bet on their own bet
  if (profile && profile.id === creatorId) {
    return (
      <div className="border-2 border-arcade-border p-4 text-center">
        <span className="font-pixel text-[10px] text-arcade-muted">
          KENDI BAHISINE KATILAMAZSIN
        </span>
      </div>
    );
  }

  // Already placed a wager
  if (existingWager) {
    return (
      <div className="border-2 border-arcade-border p-4 space-y-1">
        <p className="font-pixel text-[10px] text-arcade-muted">BAHSIN:</p>
        <p className="font-pixel text-xs text-arcade-yellow">
          {existingWager.side ? "EVET" : "HAYIR"} — {existingWager.amount} COIN
        </p>
      </div>
    );
  }

  async function handleSubmit() {
    if (side === null) {
      setError("EVET veya HAYIR sec!");
      return;
    }
    if (!profile) {
      setError("Giris yapman gerekiyor.");
      return;
    }
    setLoading(true);
    setError(null);

    const ok = await placeWager(betId, side, amount);
    setLoading(false);

    if (!ok) {
      setError("Bahis yerlestirilirken hata olustu.");
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="border-2 border-arcade-green p-4 text-center">
        <span className="font-pixel text-[10px] text-arcade-green">BAHIS YERLESTIRILDI!</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Side selection */}
      <div className="flex gap-3">
        <PixelButton
          variant="yes"
          size="lg"
          className={side === true ? "ring-2 ring-arcade-green" : "opacity-60"}
          onClick={() => setSide(true)}
          type="button"
        >
          EVET
        </PixelButton>
        <PixelButton
          variant="no"
          size="lg"
          className={side === false ? "ring-2 ring-arcade-red" : "opacity-60"}
          onClick={() => setSide(false)}
          type="button"
        >
          HAYIR
        </PixelButton>
      </div>

      {/* Amount slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-pixel text-[10px] text-arcade-muted uppercase">Miktar</label>
          <span className="font-pixel text-[10px] text-arcade-yellow">{amount} COIN</span>
        </div>
        <input
          type="range"
          min={minWager}
          max={effectiveMax > minWager ? effectiveMax : minWager}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-arcade-yellow"
        />
        <div className="flex justify-between">
          <span className="font-pixel text-[10px] text-arcade-muted">{minWager}</span>
          <span className="font-pixel text-[10px] text-arcade-muted">{effectiveMax}</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="font-pixel text-[10px] text-arcade-red">{error}</p>
      )}

      {/* Submit */}
      <PixelButton
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={loading || side === null}
        type="button"
      >
        INSERT {amount} COIN
      </PixelButton>
    </div>
  );
}

export { WagerForm };
