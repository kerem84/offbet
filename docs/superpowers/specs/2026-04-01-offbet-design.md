# OffBet - Tasarim Dokumani

**Tarih:** 2026-04-01
**Durum:** Onaylandi

## Ozet

OffBet, sirket ici eglence amacli bir bahis platformudur. Polymarket benzeri mekaniklere sahip olup, sanal "izin puani" ekonomisi uzerinden calismaktadir. Kullanicilar her turlu komik/absurd konuda bahis acar, diger kullanicilar taraf secip puan yatirir, sonuc belirlenince puanlar dagitilir. Gercek izinlerle baglantisi yoktur — saf eglence.

**Isim:** OffBet ("Office" + "Bet" veya "Off" (izin) + "Bet")
**Ton:** Retro arcade — 8-bit pixel art, chiptune sesler, oyun salonu havasi
**Hedef Kitle:** Kucuk ekip (10-30 kisi), samimi ortam

## Teknik Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime)
- **Deploy:** Vercel
- **Font:** Press Start 2P (basliklar), Inter/Space Mono (body)

## Mimari: Moduler Monolith

Tek Next.js uygulamasi, feature-based klasor yapisi. Her feature kendi icinde izole, paylasilan seyler `components/` ve `lib/` altinda.

```
offbet/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login/Register sayfalari
│   │   ├── (main)/             # Ana layout (navbar, sidebar)
│   │   │   ├── feed/           # Ana bahis akisi
│   │   │   ├── bet/[id]/       # Bahis detay sayfasi
│   │   │   ├── leaderboard/    # Skor tablosu
│   │   │   ├── profile/[id]/   # Profil sayfasi
│   │   │   └── admin/          # Bahis onaylama, sonuc belirleme
│   │   ├── api/                # Route handlers (gerekirse)
│   │   └── layout.tsx          # Root layout
│   ├── features/
│   │   ├── bets/               # Bahis olusturma, oylama, sonuclandirma
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── leaderboard/        # Siralama, istatistikler
│   │   ├── badges/             # Basarim rozetleri
│   │   ├── reactions/          # Emoji reaksiyonlar, yorumlar
│   │   └── users/              # Profil, puan yonetimi
│   ├── components/             # Paylasilan UI bilesenleri
│   ├── lib/                    # Supabase client, utils
│   └── styles/                 # Global stiller, retro theme
├── public/                     # Pixel art assetler, sesler
└── supabase/                   # Migration dosyalari
```

**Prensipler:**
- Feature'lar birbirine dogrudan import yapmaz
- Supabase client tek yerden (`lib/supabase`) export edilir
- App Router route gruplari ile auth ve main layoutlari ayrilir

## Veritabani Semasi

### profiles
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK, FK → auth.users) | Supabase Auth ile eslesir |
| username | text (unique) | Kullanici adi |
| avatar_url | text | Pixel art avatar |
| points | int (default: 100) | Sanal izin puani |
| total_wins | int | Toplam kazanilan bahis |
| total_losses | int | Toplam kaybedilen bahis |
| role | text (default: 'user') | 'user' veya 'admin' |
| created_at | timestamptz | Kayit tarihi |

### bets
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK) | |
| creator_id | uuid (FK → profiles) | Oneriyi yapan |
| title | text | "Ahmet pazartesi gec kalir mi?" |
| description | text | Detay/baglam |
| category | text | "ofis", "yemek", "toplanti", "random" |
| status | enum | draft → pending → active → resolved → cancelled |
| resolution | boolean (null) | true: evet kazandi, false: hayir kazandi |
| resolved_by | uuid (FK → profiles) | Sonucu belirleyen admin |
| min_wager | int (default: 1) | Minimum bahis miktari |
| max_wager | int (default: 10) | Maksimum bahis miktari |
| deadline | timestamptz | Bahis kapanis zamani |
| resolve_date | timestamptz | Sonucun belli olacagi tarih |
| created_at | timestamptz | |

### wagers
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK) | |
| bet_id | uuid (FK → bets) | |
| user_id | uuid (FK → profiles) | |
| side | boolean | true: "Evet", false: "Hayir" |
| amount | int | Yatirilan puan |
| payout | int (null) | Kazanc (sonuclandirildiginda) |
| created_at | timestamptz | |

### reactions
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK) | |
| bet_id | uuid (FK → bets) | |
| user_id | uuid (FK → profiles) | |
| emoji | text | Reaksiyon emojisi |
| created_at | timestamptz | |

### comments
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK) | |
| bet_id | uuid (FK → bets) | |
| user_id | uuid (FK → profiles) | |
| content | text | Yorum icerigi |
| created_at | timestamptz | |

### badges
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK) | |
| name | text | Rozet adi |
| description | text | Rozet aciklamasi |
| icon | text | Pixel art rozet path |
| condition_type | text | "wins_count", "streak", "special" |
| condition_value | int | Kosul degeri |

### user_badges
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles) | |
| badge_id | uuid (FK → badges) | |
| earned_at | timestamptz | |

### notifications
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles) | |
| type | text | "bet_approved", "bet_resolved", "badge_earned", "comment" |
| title | text | Bildirim basligi |
| message | text | Bildirim icerigi |
| bet_id | uuid (FK → bets, null) | Ilgili bahis |
| read | boolean (default: false) | Okundu mu |
| created_at | timestamptz | |

## Kazanc Hesaplama

Basit oran sistemi: kazanan taraf, havuzdaki toplam puani oransal olarak paylasir.

**Ornek:**
- "Evet" tarafina toplam 30 puan yatirildi
- "Hayir" tarafina toplam 10 puan yatirildi
- Toplam havuz: 40 puan
- "Evet" kazanirsa: her "Evet"ci yatirdiginin 40/30 = 1.33 katini alir
- "Hayir" kazanirsa: her "Hayir"ci yatirdiginin 40/10 = 4 katini alir

**Kurallar:**
- Kendi olusturdugu bahise katilamaz
- Puani 0'in altina dusemez — yatiracak puani yoksa bahis yapamaz
- Herkes baslangicta 100 puan alir

## Kullanici Akislari

### Bahis Yasam Dongusu
```
Kullanici oneri yazar → Admin onaylar → Bahis aktif olur
→ Kullanicilar "Evet/Hayir" taraf secip puan yatirir
→ Deadline gelir, bahis kapanir
→ Admin sonucu belirler → Puanlar dagitilir
```

### Ekranlar

| Ekran | Icerik |
|-------|--------|
| **Feed (Ana Sayfa)** | Aktif bahisler listesi, kart gorunumu. Her kartta: baslik, toplam havuz, oran, kalan sure (pixel art countdown), katilimci sayisi |
| **Bahis Detay** | Bahis bilgisi, Evet/Hayir oranlari (progress bar), puan yatirma slider'i, yorumlar + reaksiyonlar, katilimci listesi |
| **Bahis Oner** | Form: baslik, aciklama, kategori, deadline, sonuc tarihi. "INSERT COIN" butonu ile gonder |
| **Leaderboard** | Arcade high-score tablosu estetigi. Haftalik/aylik/tum zamanlar filtreleri. Top 3 ozel pixel art tac/rozet |
| **Profil** | Pixel art avatar, toplam puan, kazanma/kaybetme orani, rozet koleksiyonu, bahis gecmisi |
| **Admin Panel** | Onay bekleyen oneriler listesi, aktif bahisleri sonuclandirma, kullanici yonetimi |

## Authentication & Yetkilendirme

**Auth Akisi:**
- Supabase Auth ile email/password kayit ve giris
- Ilk kayitta otomatik `profiles` satiri olusturulur (Supabase trigger)
- Baslangic puani: 100

**Roller:**

| Rol | Yetkiler |
|-----|----------|
| user | Bahis oner, bahis yap, yorum/reaksiyon, kendi profilini duzenle |
| admin | Yukaridakilere ek: bahis onayla/reddet, sonuc belirle, kullanici yonetimi |

**Row Level Security (RLS):**
- Herkes aktif bahisleri gorebilir
- Kullanici sadece kendi wager'larini olusturabilir
- Sadece admin `bets.status` degistirebilir ve sonuc belirleyebilir
- Kullanici sadece kendi profilini guncelleyebilir
- Yorumlari herkes okur, sadece yazan siler

**Admin Atama:**
- Ilk kullanici otomatik admin olur
- Admin baska kullanicilari admin yapabilir

## Realtime & Bildirimler

### Supabase Realtime Kanallari

| Kanal | Tetikleyici | Etki |
|-------|------------|------|
| `bets` tablosu | Yeni bahis aktif olunca | Feed'de canli kart eklenir |
| `wagers` tablosu | Biri bahis yapinca | Bahis detayda oran cubugu canli guncellenir |
| `bets.status` → resolved | Sonuc belirlenince | Kazananlara pixel coin yagmuru, kaybedenlere "Game Over" animasyonu |
| `comments` tablosu | Yeni yorum | Bahis detayda canli yorum akisi |
| `reactions` tablosu | Yeni reaksiyon | Emoji sayaci canli artar |

### Bildirimler (Sadece Uygulama Ici)
- Pixel art popup / toast bildirimleri
- Tetikleyiciler:
  - Onerdigin bahis onaylandi/reddedildi
  - Katildigin bahis sonuclandi (kazandin/kaybettin + miktar)
  - Yeni rozet kazandin
  - Biri senin bahisine yorum yapti

## Tasarim Sistemi & Retro Arcade Kimligi

### Renk Paleti
| Renk | Hex | Kullanim |
|------|-----|----------|
| Ana zemin | `#0f0e17` | Koyu lacivert/siyah — arcade kabini hissi |
| Vurgu 1 | `#2de370` | Neon yesil — kazanc, pozitif |
| Vurgu 2 | `#ff5555` | Neon kirmizi — kayip, negatif |
| Vurgu 3 | `#ffe66d` | Neon sari — puan, coin |
| Vurgu 4 | `#a855f7` | Neon mor — rozetler, ozel |
| Kart zemin | `#1a1a2e` | Koyu gri — hafif CRT hissi |
| Metin | `#ffffff` / `#a0a0b0` | Beyaz / acik gri |

### Tipografi
- **Basliklar:** `Press Start 2P` (Google Fonts — pixel font)
- **Body:** `Inter` veya `Space Mono` — okunabilirlik icin

### Bilesen Kimligi
- **Butonlar:** pixel-art border, hover'da titreme efekti, tiklamada "basilma" animasyonu
- **Kartlar:** 2px solid border neon renkli, hafif CRT scanline overlay
- **Progress bar:** retro HP bar stili, yesil vs kirmizi
- **Avatar:** pixel art karakter secimi (onceden tanimli 10-15 avatar)
- **Coin ikonu:** animasyonlu pixel coin (puan gostergesi yaninda doner)

### Ses Efektleri (toggle ile kapanabilir)
| Etkilesim | Ses |
|-----------|-----|
| Bahis yapma | "coin insert" chiptune |
| Kazanc | Kisa zafer melodisi |
| Kayip | "wah wah" efekti |
| Rozet kazanma | Level-up sesi |
| Buton tiklama | Hafif "blip" |

### Mikro-Etkilesimler
- Hover'da buton "titrer"
- Bahis kartlari CRT scanline efekti
- Leaderboard'da siralama degisince animasyon
- Kazanc aninda ekranda pixel coin yagmuru
- Yeni rozet kazaninca parlama efekti

## Rozet Sistemi

| Rozet | Kosul | Ikon |
|-------|-------|------|
| Ilk Kan | Ilk bahsi kazan | Pixel kilic |
| Kumarhane Krali | 10 bahis kazan | Pixel tac |
| Tam Kayip | Puani 0'a dussun | Pixel kafatasi |
| Kahin | 5 bahis arka arkaya kazan | Pixel kristal kure |
| Troll | 10 bahis oner | Pixel troll yuzu |
| High Roller | Tek bahiste 50+ puan yatir | Pixel elmas |
| Survivor | Puani 5'in altina dusup 50'nin ustune cik | Pixel kalp |
