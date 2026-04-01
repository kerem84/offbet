# OffBet — Ofis Bahis Salonu 🎰

Sirket ici eglence amacli retro arcade temali bahis platformu. Calisanlar sanal "izin puani" ile komik/absurd konularda bahis yapar.

**Gercek parayla baglantisi yoktur — saf eglence.**

## Ozellikler

- **Bahis Olusturma** — Herkes bahis onerir, admin onaylar
- **Sanal Puan Ekonomisi** — Herkes 100 puanla baslar, EVET/HAYIR taraf secip puan yatirir
- **Oransal Kazanc** — Havuzdaki toplam puan kazanan tarafa oransal dagitilir
- **Leaderboard** — Arcade high-score tablosu
- **Rozetler** — Ilk Kan, Kumarhane Krali, Kahin, Troll gibi basarim rozetleri
- **Reaksiyonlar & Yorumlar** — Bahislere emoji tepki ve yorum
- **Bildirimler** — Realtime bildirimler (kazandin/kaybettin)
- **Ses Efektleri** — Chiptune coin, win, lose, blip sesleri
- **Admin Paneli** — Bahis onay/red, sonuclandirma, kullanici yonetimi (rol, puan reset, bonus)

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime + RLS)
- **Font:** Press Start 2P (pixel) + Inter (body)
- **Deploy:** Vercel

## Kurulum

```bash
# Clone
git clone https://github.com/kerem84/offbet.git
cd offbet

# Install
npm install

# Environment
cp .env.local.example .env.local
# NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY degerlerini gir

# Supabase migration
# supabase/migrations/001_initial_schema.sql ve 002_fix_rls_for_resolution.sql
# dosyalarini Supabase Dashboard > SQL Editor'de calistir

# Dev server
npm run dev
```

## Ekranlar

| Sayfa | Route | Aciklama |
|-------|-------|----------|
| Login | `/login` | Retro "INSERT COIN" giris ekrani |
| Register | `/register` | "NEW PLAYER" kayit ekrani |
| Feed | `/feed` | Aktif bahisler grid gorunumu |
| Bahis Detay | `/bet/[id]` | Oran cubugu, wager form, yorumlar |
| Bahis Oner | `/propose` | Yeni bahis onerme formu |
| Leaderboard | `/leaderboard` | Arcade high-score tablosu |
| Profil | `/profile/[id]` | Puan, W/L, rozetler, avatar |
| Admin | `/admin` | Onay, sonuclandirma, kullanici yonetimi |

## Tasarim

Retro arcade / 8-bit pixel art temasi:
- Koyu lacivert zemin, neon yesil/kirmizi/sari/mor vurgular
- CRT scanline efekti
- Pixel font basliklar
- Chiptune ses efektleri

## Lisans

MIT
