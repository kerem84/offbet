"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelInput } from "@/components/ui/pixel-input";
import { PixelButton } from "@/components/ui/pixel-button";
import { useAuth } from "@/components/providers";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

function ProposeBetForm() {
  const router = useRouter();
  const { profile } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [deadline, setDeadline] = useState("");
  const [resolveDate, setResolveDate] = useState("");
  const [minWager, setMinWager] = useState(10);
  const [maxWager, setMaxWager] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) {
      setError("Giris yapman gerekiyor.");
      return;
    }
    if (!title.trim()) {
      setError("Baslik zorunludur.");
      return;
    }
    if (!deadline) {
      setError("Son katilim tarihi zorunludur.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("bets").insert({
      creator_id: profile.id,
      title: title.trim(),
      description: description.trim() || null,
      category,
      status: "pending",
      deadline,
      resolve_date: resolveDate || null,
      min_wager: minWager,
      max_wager: maxWager,
    });

    setLoading(false);

    if (insertError) {
      setError("Bahis onerisi gonderilemedi: " + insertError.message);
      return;
    }

    router.push("/feed");
  }

  return (
    <PixelCard glowColor="#22c55e">
      <h2 className="font-pixel text-sm text-arcade-green mb-6">YENI BAHIS ONER</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <PixelInput
          id="bet-title"
          label="Baslik"
          placeholder="Bahis basligini yaz..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="bet-desc" className="font-pixel text-[10px] text-arcade-muted uppercase">
            Aciklama
          </label>
          <textarea
            id="bet-desc"
            rows={3}
            placeholder="Detaylar..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-arcade-bg border-2 border-arcade-border px-3 py-2 text-sm focus:border-arcade-yellow focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label htmlFor="bet-category" className="font-pixel text-[10px] text-arcade-muted uppercase">
            Kategori
          </label>
          <select
            id="bet-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-arcade-bg border-2 border-arcade-border px-3 py-2 text-sm focus:border-arcade-yellow focus:outline-none transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <PixelInput
          id="bet-deadline"
          label="Son Katilim Tarihi"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        {/* Resolve Date */}
        <PixelInput
          id="bet-resolve"
          label="Cozum Tarihi (opsiyonel)"
          type="datetime-local"
          value={resolveDate}
          onChange={(e) => setResolveDate(e.target.value)}
        />

        {/* Min / Max Wager */}
        <div className="grid grid-cols-2 gap-3">
          <PixelInput
            id="bet-min"
            label="Min Wager"
            type="number"
            min={1}
            value={minWager}
            onChange={(e) => setMinWager(Number(e.target.value))}
          />
          <PixelInput
            id="bet-max"
            label="Max Wager"
            type="number"
            min={minWager}
            value={maxWager}
            onChange={(e) => setMaxWager(Number(e.target.value))}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="font-pixel text-[10px] text-arcade-red">{error}</p>
        )}

        {/* Submit */}
        <PixelButton
          variant="yes"
          size="lg"
          className="w-full"
          type="submit"
          disabled={loading}
        >
          INSERT COIN — ONER
        </PixelButton>
      </form>
    </PixelCard>
  );
}

export { ProposeBetForm };
