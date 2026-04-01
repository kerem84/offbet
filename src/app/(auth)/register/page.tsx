"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelInput } from "@/components/ui/pixel-input";
import { PixelButton } from "@/components/ui/pixel-button";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
  }

  return (
    <PixelCard>
      <div className="p-6">
        <h2 className="font-pixel text-xl text-arcade-green mb-6 text-center">
          NEW PLAYER
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PixelInput
            type="text"
            placeholder="KULLANICI ADI"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <PixelInput
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PixelInput
            type="password"
            placeholder="SIFRE"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && (
            <p className="font-pixel text-[10px] text-arcade-red text-center">
              {error}
            </p>
          )}

          <PixelButton type="submit" className="w-full" disabled={loading}>
            {loading ? "YUKLENIYOR..." : "KAYIT OL"}
          </PixelButton>
        </form>

        <p className="font-pixel text-[10px] text-arcade-muted text-center mt-6">
          Zaten hesabin var mi?{" "}
          <Link href="/login" className="text-arcade-yellow hover:underline">
            Giris Yap
          </Link>
        </p>
      </div>
    </PixelCard>
  );
}
