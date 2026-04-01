# OffBet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build OffBet — a retro arcade-themed internal company betting platform where employees bet virtual "leave points" on fun predictions.

**Architecture:** Modular monolith Next.js app with feature-based folder structure. Supabase handles auth, database, realtime, and RLS. Each feature (`bets`, `leaderboard`, `badges`, `reactions`, `users`) is self-contained with its own components, hooks, and types.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Supabase (PostgreSQL + Auth + Realtime), TypeScript, Press Start 2P font

**Spec:** `docs/superpowers/specs/2026-04-01-offbet-design.md`

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                          # Root layout: fonts, providers, metadata
│   ├── globals.css                         # Tailwind + retro theme CSS
│   ├── (auth)/
│   │   ├── layout.tsx                      # Centered auth layout
│   │   ├── login/page.tsx                  # Login form
│   │   └── register/page.tsx               # Register form
│   ├── (main)/
│   │   ├── layout.tsx                      # Navbar + sidebar layout, auth guard
│   │   ├── feed/page.tsx                   # Active bets feed
│   │   ├── bet/[id]/page.tsx               # Bet detail page
│   │   ├── propose/page.tsx                # Propose a bet form
│   │   ├── leaderboard/page.tsx            # High score table
│   │   ├── profile/[id]/page.tsx           # User profile
│   │   └── admin/page.tsx                  # Admin panel
│   └── api/
│       └── resolve-bet/route.ts            # Server action: resolve bet + distribute payouts
├── features/
│   ├── bets/
│   │   ├── components/
│   │   │   ├── bet-card.tsx                # Bet card for feed
│   │   │   ├── bet-detail.tsx              # Full bet view with wager form
│   │   │   ├── propose-bet-form.tsx        # Bet proposal form
│   │   │   └── wager-form.tsx              # Place wager (side + amount)
│   │   ├── hooks/
│   │   │   ├── use-bets.ts                 # Fetch + realtime bets
│   │   │   ├── use-bet.ts                  # Single bet + realtime
│   │   │   └── use-wager.ts                # Place wager mutation
│   │   ├── types.ts                        # Bet, Wager, BetStatus types
│   │   └── utils.ts                        # Payout calculation, odds
│   ├── leaderboard/
│   │   ├── components/
│   │   │   └── leaderboard-table.tsx       # High score table component
│   │   ├── hooks/
│   │   │   └── use-leaderboard.ts          # Fetch leaderboard data
│   │   └── types.ts                        # LeaderboardEntry type
│   ├── badges/
│   │   ├── components/
│   │   │   ├── badge-display.tsx           # Single badge with tooltip
│   │   │   └── badge-collection.tsx        # User's badge grid
│   │   ├── hooks/
│   │   │   └── use-badges.ts              # Fetch user badges
│   │   └── types.ts                        # Badge, UserBadge types
│   ├── reactions/
│   │   ├── components/
│   │   │   ├── reaction-bar.tsx            # Emoji reaction buttons
│   │   │   └── comment-list.tsx            # Comments thread
│   │   ├── hooks/
│   │   │   ├── use-reactions.ts            # Fetch + add reactions
│   │   │   └── use-comments.ts             # Fetch + add comments
│   │   └── types.ts                        # Reaction, Comment types
│   ├── users/
│   │   ├── components/
│   │   │   ├── user-profile.tsx            # Profile card
│   │   │   └── avatar-picker.tsx           # Pixel art avatar selection
│   │   ├── hooks/
│   │   │   └── use-profile.ts              # Fetch + update profile
│   │   └── types.ts                        # Profile type
│   └── notifications/
│       ├── components/
│       │   └── notification-toast.tsx       # Pixel art toast popup
│       ├── hooks/
│       │   └── use-notifications.ts         # Fetch + realtime notifications
│       └── types.ts                         # Notification type
├── components/
│   ├── ui/
│   │   ├── pixel-button.tsx                # Retro button with shake/press animation
│   │   ├── pixel-card.tsx                  # CRT scanline card
│   │   ├── hp-bar.tsx                      # Retro HP-style progress bar
│   │   ├── coin-counter.tsx                # Animated coin + point display
│   │   ├── countdown.tsx                   # Pixel art countdown timer
│   │   └── pixel-input.tsx                 # Retro styled input
│   ├── layout/
│   │   ├── navbar.tsx                      # Top nav with coin counter, notifications
│   │   └── sidebar.tsx                     # Navigation sidebar
│   └── providers.tsx                       # Supabase + sound context providers
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser Supabase client
│   │   ├── server.ts                       # Server Supabase client
│   │   └── middleware.ts                   # Auth middleware
│   ├── sounds.ts                           # Sound effect manager
│   └── constants.ts                        # Categories, emojis, avatar list
└── styles/
    └── retro-theme.ts                      # Tailwind theme extension values

supabase/
└── migrations/
    └── 001_initial_schema.sql              # All tables, RLS, triggers, seed badges

public/
├── sounds/                                 # Chiptune sound files
└── avatars/                                # Pixel art avatar PNGs
```

---

## Task 1: Project Scaffolding & Tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.local.example`, `.gitignore`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:/kt/upwork/poly_market
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This creates the full Next.js scaffolding.

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install class-variance-authority clsx tailwind-merge
npm install date-fns
```

- [ ] **Step 3: Create environment template**

Create `.env.local.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- [ ] **Step 4: Add retro theme to Tailwind config**

Replace `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: "#0f0e17",
          card: "#1a1a2e",
          green: "#2de370",
          red: "#ff5555",
          yellow: "#ffe66d",
          purple: "#a855f7",
          text: "#ffffff",
          muted: "#a0a0b0",
          border: "#2a2a4a",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "coin-spin": "coin-spin 1s steps(8) infinite",
        shake: "shake 0.3s ease-in-out",
        "press-down": "press-down 0.1s ease-in-out",
        "coin-rain": "coin-rain 1s ease-out forwards",
        glow: "glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        "coin-spin": {
          "0%, 100%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(180deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "75%": { transform: "translateX(2px)" },
        },
        "press-down": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(2px)" },
          "100%": { transform: "translateY(0)" },
        },
        "coin-rain": {
          "0%": { transform: "translateY(-20px)", opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px currentColor" },
          "100%": { boxShadow: "0 0 20px currentColor" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Set up globals.css with retro theme**

Replace `src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-arcade-bg: #0f0e17;
  --color-arcade-card: #1a1a2e;
  --color-arcade-green: #2de370;
  --color-arcade-red: #ff5555;
  --color-arcade-yellow: #ffe66d;
  --color-arcade-purple: #a855f7;
  --color-arcade-text: #ffffff;
  --color-arcade-muted: #a0a0b0;
  --color-arcade-border: #2a2a4a;

  --font-pixel: "Press Start 2P", monospace;
  --font-body: "Inter", sans-serif;

  --animate-coin-spin: coin-spin 1s steps(8) infinite;
  --animate-shake: shake 0.3s ease-in-out;
  --animate-press-down: press-down 0.1s ease-in-out;
  --animate-coin-rain: coin-rain 1s ease-out forwards;
  --animate-glow: glow 1.5s ease-in-out infinite alternate;
}

@keyframes coin-spin {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes press-down {
  0% { transform: translateY(0); }
  50% { transform: translateY(2px); }
  100% { transform: translateY(0); }
}

@keyframes coin-rain {
  0% { transform: translateY(-20px); opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px currentColor; }
  100% { box-shadow: 0 0 20px currentColor; }
}

/* CRT Scanline overlay */
.crt-overlay {
  position: relative;
}
.crt-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  border-radius: inherit;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-arcade-bg);
  color: var(--color-arcade-text);
}
```

- [ ] **Step 6: Set up root layout with fonts**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "OffBet — Ofis Bahis Salonu",
  description: "Sanal izin puanlariyla sirket ici eglence bahis platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${pressStart2P.variable}`}>
      <body className="min-h-screen bg-arcade-bg text-arcade-text font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder home page**

Replace `src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-pixel text-2xl text-arcade-yellow mb-4">
          OFFBET
        </h1>
        <p className="text-arcade-muted text-sm">
          Ofis Bahis Salonu — Coming Soon
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```
Expected: Server starts on localhost:3000, shows "OFFBET" title with pixel font on dark background.

- [ ] **Step 9: Initialize git and commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with retro arcade theme"
```

---

## Task 2: Supabase Client Setup

**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create shared database types**

Create `src/lib/supabase/database.types.ts`:
```ts
export type BetStatus = "draft" | "pending" | "active" | "resolved" | "cancelled";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          points: number;
          total_wins: number;
          total_losses: number;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          points?: number;
          total_wins?: number;
          total_losses?: number;
          role?: "user" | "admin";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      bets: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          category: string;
          status: BetStatus;
          resolution: boolean | null;
          resolved_by: string | null;
          min_wager: number;
          max_wager: number;
          deadline: string;
          resolve_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          category: string;
          status?: BetStatus;
          resolution?: boolean | null;
          resolved_by?: string | null;
          min_wager?: number;
          max_wager?: number;
          deadline: string;
          resolve_date?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bets"]["Insert"]>;
      };
      wagers: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          side: boolean;
          amount: number;
          payout: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bet_id: string;
          user_id: string;
          side: boolean;
          amount: number;
          payout?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wagers"]["Insert"]>;
      };
      reactions: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          bet_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reactions"]["Insert"]>;
      };
      comments: {
        Row: {
          id: string;
          bet_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          bet_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          bet_id: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          bet_id?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
  };
};
```

- [ ] **Step 2: Create browser Supabase client**

Create `src/lib/supabase/client.ts`:
```ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 3: Create server Supabase client**

Create `src/lib/supabase/server.ts`:
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );
}
```

- [ ] **Step 4: Create auth middleware**

Create `src/lib/supabase/middleware.ts`:
```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login (except auth pages)
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

- [ ] **Step 5: Wire up Next.js middleware**

Create `src/middleware.ts`:
```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sounds|avatars|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabase src/middleware.ts
git commit -m "feat: set up Supabase client, server, and auth middleware"
```

---

## Task 3: Supabase Database Schema & Migrations

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Write the full migration**

Create `supabase/migrations/001_initial_schema.sql`:
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TYPES
-- ============================================
create type bet_status as enum ('draft', 'pending', 'active', 'resolved', 'cancelled');

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  points int not null default 100,
  total_wins int not null default 0,
  total_losses int not null default 0,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Bets
create table public.bets (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null default 'random',
  status bet_status not null default 'pending',
  resolution boolean,
  resolved_by uuid references public.profiles(id),
  min_wager int not null default 1,
  max_wager int not null default 10,
  deadline timestamptz not null,
  resolve_date timestamptz,
  created_at timestamptz not null default now()
);

-- Wagers
create table public.wagers (
  id uuid primary key default uuid_generate_v4(),
  bet_id uuid references public.bets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  side boolean not null,
  amount int not null check (amount > 0),
  payout int,
  created_at timestamptz not null default now(),
  unique(bet_id, user_id)
);

-- Reactions
create table public.reactions (
  id uuid primary key default uuid_generate_v4(),
  bet_id uuid references public.bets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique(bet_id, user_id, emoji)
);

-- Comments
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  bet_id uuid references public.bets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Badges
create table public.badges (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text not null,
  icon text not null,
  condition_type text not null,
  condition_value int not null default 0
);

-- User Badges
create table public.user_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id uuid references public.badges(id) on delete cascade not null,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- Notifications
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text not null,
  bet_id uuid references public.bets(id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_bets_status on public.bets(status);
create index idx_bets_creator on public.bets(creator_id);
create index idx_bets_deadline on public.bets(deadline);
create index idx_wagers_bet on public.wagers(bet_id);
create index idx_wagers_user on public.wagers(user_id);
create index idx_comments_bet on public.comments(bet_id);
create index idx_reactions_bet on public.reactions(bet_id);
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id) where read = false;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.bets enable row level security;
alter table public.wagers enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.notifications enable row level security;

-- Profiles: everyone reads, user updates own
create policy "Profiles: public read" on public.profiles for select using (true);
create policy "Profiles: user updates own" on public.profiles for update using (auth.uid() = id);
create policy "Profiles: insert own" on public.profiles for insert with check (auth.uid() = id);

-- Bets: everyone reads, creator inserts (as pending), admin updates status
create policy "Bets: public read" on public.bets for select using (true);
create policy "Bets: authenticated insert" on public.bets for insert
  with check (auth.uid() = creator_id and status = 'pending');
create policy "Bets: admin update" on public.bets for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Wagers: everyone reads, user inserts own (not on own bet)
create policy "Wagers: public read" on public.wagers for select using (true);
create policy "Wagers: user inserts own" on public.wagers for insert
  with check (
    auth.uid() = user_id
    and not exists (select 1 from public.bets where id = bet_id and creator_id = auth.uid())
  );

-- Reactions: everyone reads, user inserts/deletes own
create policy "Reactions: public read" on public.reactions for select using (true);
create policy "Reactions: user inserts own" on public.reactions for insert with check (auth.uid() = user_id);
create policy "Reactions: user deletes own" on public.reactions for delete using (auth.uid() = user_id);

-- Comments: everyone reads, user inserts own, user deletes own
create policy "Comments: public read" on public.comments for select using (true);
create policy "Comments: user inserts own" on public.comments for insert with check (auth.uid() = user_id);
create policy "Comments: user deletes own" on public.comments for delete using (auth.uid() = user_id);

-- Badges: everyone reads
create policy "Badges: public read" on public.badges for select using (true);

-- User Badges: everyone reads
create policy "User badges: public read" on public.user_badges for select using (true);

-- Notifications: user reads own, system inserts
create policy "Notifications: user reads own" on public.notifications for select using (auth.uid() = user_id);
create policy "Notifications: user updates own" on public.notifications for update using (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_count int;
  user_role text;
begin
  select count(*) into user_count from public.profiles;
  -- First user becomes admin
  if user_count = 0 then
    user_role := 'admin';
  else
    user_role := 'user';
  end if;

  insert into public.profiles (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    user_role
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- SEED DATA: Badges
-- ============================================
insert into public.badges (name, description, icon, condition_type, condition_value) values
  ('Ilk Kan', 'Ilk bahsini kazan', '/avatars/badge-sword.png', 'wins_count', 1),
  ('Kumarhane Krali', '10 bahis kazan', '/avatars/badge-crown.png', 'wins_count', 10),
  ('Tam Kayip', 'Puanin 0''a dussun', '/avatars/badge-skull.png', 'zero_points', 0),
  ('Kahin', '5 bahis arka arkaya kazan', '/avatars/badge-crystal.png', 'streak', 5),
  ('Troll', '10 bahis oner', '/avatars/badge-troll.png', 'proposals_count', 10),
  ('High Roller', 'Tek bahiste 50+ puan yatir', '/avatars/badge-diamond.png', 'single_wager', 50),
  ('Survivor', 'Puanin 5''in altina dusup 50''nin ustune cik', '/avatars/badge-heart.png', 'survivor', 0);

-- ============================================
-- REALTIME
-- ============================================
alter publication supabase_realtime add table public.bets;
alter publication supabase_realtime add table public.wagers;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.reactions;
alter publication supabase_realtime add table public.notifications;
```

- [ ] **Step 2: Run migration in Supabase**

Go to Supabase Dashboard → SQL Editor → paste and run the migration. Verify all tables appear in Table Editor.

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema with RLS, triggers, and seed badges"
```

---

## Task 4: Shared UI Components (Retro Design System)

**Files:**
- Create: `src/components/ui/pixel-button.tsx`, `src/components/ui/pixel-card.tsx`, `src/components/ui/hp-bar.tsx`, `src/components/ui/coin-counter.tsx`, `src/components/ui/countdown.tsx`, `src/components/ui/pixel-input.tsx`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Create constants**

Create `src/lib/constants.ts`:
```ts
export const CATEGORIES = [
  { value: "ofis", label: "Ofis" },
  { value: "yemek", label: "Yemek" },
  { value: "toplanti", label: "Toplanti" },
  { value: "random", label: "Random" },
] as const;

export const REACTION_EMOJIS = ["🔥", "💀", "🤡", "😂", "🎰", "💰", "🎯", "👀"] as const;

export const AVATARS = Array.from({ length: 12 }, (_, i) => `/avatars/avatar-${i + 1}.png`);

export const STARTING_POINTS = 100;
```

- [ ] **Step 2: Create PixelButton**

Create `src/components/ui/pixel-button.tsx`:
```tsx
"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "danger" | "ghost" | "yes" | "no";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<Variant, string> = {
  primary:
    "border-arcade-yellow text-arcade-yellow hover:bg-arcade-yellow/10",
  danger:
    "border-arcade-red text-arcade-red hover:bg-arcade-red/10",
  ghost:
    "border-arcade-muted text-arcade-muted hover:bg-arcade-muted/10",
  yes: "border-arcade-green text-arcade-green hover:bg-arcade-green/10",
  no: "border-arcade-red text-arcade-red hover:bg-arcade-red/10",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-5 py-2.5 text-xs",
  lg: "px-8 py-3.5 text-sm",
};

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          font-pixel border-2 transition-all duration-150
          hover:animate-shake active:animate-press-down
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:animate-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PixelButton.displayName = "PixelButton";
```

- [ ] **Step 3: Create PixelCard**

Create `src/components/ui/pixel-card.tsx`:
```tsx
import { HTMLAttributes } from "react";

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
}

export function PixelCard({
  glowColor,
  className = "",
  children,
  ...props
}: PixelCardProps) {
  return (
    <div
      className={`
        crt-overlay bg-arcade-card border-2 border-arcade-border
        p-4 transition-all duration-200
        hover:border-arcade-muted
        ${glowColor ? `hover:shadow-[0_0_15px_${glowColor}]` : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create HpBar (retro progress bar)**

Create `src/components/ui/hp-bar.tsx`:
```tsx
interface HpBarProps {
  yesAmount: number;
  noAmount: number;
}

export function HpBar({ yesAmount, noAmount }: HpBarProps) {
  const total = yesAmount + noAmount;
  const yesPercent = total === 0 ? 50 : Math.round((yesAmount / total) * 100);
  const noPercent = 100 - yesPercent;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="font-pixel text-[10px] text-arcade-green">
          EVET {yesPercent}%
        </span>
        <span className="font-pixel text-[10px] text-arcade-red">
          HAYIR {noPercent}%
        </span>
      </div>
      <div className="w-full h-4 bg-arcade-bg border border-arcade-border flex overflow-hidden">
        <div
          className="h-full bg-arcade-green transition-all duration-500"
          style={{ width: `${yesPercent}%` }}
        />
        <div
          className="h-full bg-arcade-red transition-all duration-500"
          style={{ width: `${noPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-arcade-muted">{yesAmount} puan</span>
        <span className="text-xs text-arcade-muted">{noAmount} puan</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create CoinCounter**

Create `src/components/ui/coin-counter.tsx`:
```tsx
"use client";

interface CoinCounterProps {
  amount: number;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "text-xs gap-1",
  md: "text-sm gap-1.5",
  lg: "text-base gap-2",
};

const coinSizes = {
  sm: "w-4 h-4 text-[8px]",
  md: "w-5 h-5 text-[10px]",
  lg: "w-6 h-6 text-xs",
};

export function CoinCounter({ amount, size = "md" }: CoinCounterProps) {
  return (
    <div className={`flex items-center font-pixel text-arcade-yellow ${sizeStyles[size]}`}>
      <div
        className={`inline-flex items-center justify-center bg-arcade-yellow text-arcade-bg rounded-full animate-coin-spin ${coinSizes[size]}`}
      >
        $
      </div>
      <span>{amount}</span>
    </div>
  );
}
```

- [ ] **Step 6: Create Countdown timer**

Create `src/components/ui/countdown.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  deadline: string;
}

function getTimeLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { expired: true, d: 0, h: 0, m: 0, s: 0 };

  return {
    expired: false,
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ deadline }: CountdownProps) {
  const [time, setTime] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(deadline)), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (time.expired) {
    return (
      <span className="font-pixel text-[10px] text-arcade-red animate-glow">
        SURESI DOLDU
      </span>
    );
  }

  const parts = [];
  if (time.d > 0) parts.push(`${time.d}g`);
  parts.push(`${time.h}s`);
  parts.push(`${String(time.m).padStart(2, "0")}d`);
  parts.push(`${String(time.s).padStart(2, "0")}s`);

  return (
    <span className="font-pixel text-[10px] text-arcade-yellow">
      {parts.join(":")}
    </span>
  );
}
```

- [ ] **Step 7: Create PixelInput**

Create `src/components/ui/pixel-input.tsx`:
```tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="font-pixel text-[10px] text-arcade-muted uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            bg-arcade-bg border-2 border-arcade-border px-3 py-2
            text-arcade-text font-body text-sm
            focus:border-arcade-yellow focus:outline-none
            placeholder:text-arcade-muted/50
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);
PixelInput.displayName = "PixelInput";
```

- [ ] **Step 8: Verify components render**

Update `src/app/page.tsx` temporarily to import and render each component visually. Check they appear correctly.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui src/lib/constants.ts
git commit -m "feat: add retro arcade UI component library"
```

---

## Task 5: Authentication Pages

**Files:**
- Create: `src/app/(auth)/layout.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Create auth layout**

Create `src/app/(auth)/layout.tsx`:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-arcade-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-3xl text-arcade-yellow mb-2">OFFBET</h1>
          <p className="font-pixel text-[10px] text-arcade-muted">OFIS BAHIS SALONU</p>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create login page**

Create `src/app/(auth)/login/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelInput } from "@/components/ui/pixel-input";
import { PixelCard } from "@/components/ui/pixel-card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <PixelCard>
      <h2 className="font-pixel text-sm text-arcade-green text-center mb-6">
        INSERT COIN
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PixelInput
          label="Email"
          type="email"
          placeholder="player@offbet.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PixelInput
          label="Sifre"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="font-pixel text-[10px] text-arcade-red">{error}</p>
        )}
        <PixelButton type="submit" disabled={loading} className="w-full mt-2">
          {loading ? "YUKLENIYOR..." : "GIRIS YAP"}
        </PixelButton>
      </form>
      <p className="text-center text-sm text-arcade-muted mt-4">
        Hesabin yok mu?{" "}
        <Link href="/register" className="text-arcade-yellow hover:underline">
          Kayit Ol
        </Link>
      </p>
    </PixelCard>
  );
}
```

- [ ] **Step 3: Create register page**

Create `src/app/(auth)/register/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelInput } from "@/components/ui/pixel-input";
import { PixelCard } from "@/components/ui/pixel-card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <PixelCard>
      <h2 className="font-pixel text-sm text-arcade-green text-center mb-6">
        NEW PLAYER
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PixelInput
          label="Kullanici Adi"
          type="text"
          placeholder="player1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <PixelInput
          label="Email"
          type="email"
          placeholder="player@offbet.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PixelInput
          label="Sifre"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && (
          <p className="font-pixel text-[10px] text-arcade-red">{error}</p>
        )}
        <PixelButton type="submit" disabled={loading} className="w-full mt-2">
          {loading ? "YUKLENIYOR..." : "KAYIT OL"}
        </PixelButton>
      </form>
      <p className="text-center text-sm text-arcade-muted mt-4">
        Zaten hesabin var mi?{" "}
        <Link href="/login" className="text-arcade-yellow hover:underline">
          Giris Yap
        </Link>
      </p>
    </PixelCard>
  );
}
```

- [ ] **Step 4: Verify auth flow**

1. Start dev server: `npm run dev`
2. Go to `/login` — see retro login form
3. Go to `/register` — see retro register form
4. Unauthenticated users redirected to `/login` when visiting `/feed`

- [ ] **Step 5: Commit**

```bash
git add src/app/\(auth\)
git commit -m "feat: add retro arcade login and register pages"
```

---

## Task 6: Main Layout (Navbar + Sidebar)

**Files:**
- Create: `src/components/layout/navbar.tsx`, `src/components/layout/sidebar.tsx`
- Create: `src/app/(main)/layout.tsx`
- Create: `src/components/providers.tsx`

- [ ] **Step 1: Create Providers wrapper**

Create `src/components/providers.tsx`:
```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Wire providers into root layout**

Update `src/app/layout.tsx` — wrap `{children}` with `<Providers>`:
```tsx
import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "OffBet — Ofis Bahis Salonu",
  description: "Sanal izin puanlariyla sirket ici eglence bahis platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${pressStart2P.variable}`}>
      <body className="min-h-screen bg-arcade-bg text-arcade-text font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create Navbar**

Create `src/components/layout/navbar.tsx`:
```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { CoinCounter } from "@/components/ui/coin-counter";
import { PixelButton } from "@/components/ui/pixel-button";

export function Navbar() {
  const { profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-arcade-card border-b-2 border-arcade-border h-14 flex items-center px-4">
      <Link href="/feed" className="font-pixel text-lg text-arcade-yellow hover:text-arcade-yellow/80">
        OFFBET
      </Link>

      <div className="ml-auto flex items-center gap-4">
        {profile && (
          <>
            <CoinCounter amount={profile.points} />
            <Link
              href={`/profile/${profile.id}`}
              className="text-sm text-arcade-muted hover:text-arcade-text"
            >
              {profile.username}
            </Link>
            {profile.role === "admin" && (
              <Link href="/admin" className="font-pixel text-[10px] text-arcade-purple">
                ADMIN
              </Link>
            )}
            <PixelButton variant="ghost" size="sm" onClick={handleLogout}>
              CIKIS
            </PixelButton>
          </>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Create Sidebar**

Create `src/components/layout/sidebar.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/feed", label: "BAHISLER", icon: "🎰" },
  { href: "/propose", label: "ONER", icon: "🎲" },
  { href: "/leaderboard", label: "SKOR", icon: "🏆" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-48 bg-arcade-card border-r-2 border-arcade-border p-4 flex flex-col gap-2">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2.5 font-pixel text-[10px] transition-colors
              ${active
                ? "text-arcade-yellow border-l-2 border-arcade-yellow bg-arcade-yellow/5"
                : "text-arcade-muted hover:text-arcade-text hover:bg-arcade-bg/50"
              }
            `}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
```

- [ ] **Step 5: Create main layout**

Create `src/app/(main)/layout.tsx`:
```tsx
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="pt-14 pl-48 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </>
  );
}
```

- [ ] **Step 6: Create placeholder feed page**

Create `src/app/(main)/feed/page.tsx`:
```tsx
export default function FeedPage() {
  return (
    <div>
      <h1 className="font-pixel text-lg text-arcade-yellow mb-4">AKTIF BAHISLER</h1>
      <p className="text-arcade-muted">Henuz bahis yok. Ilk bahsi sen oner!</p>
    </div>
  );
}
```

- [ ] **Step 7: Redirect root to feed**

Replace `src/app/page.tsx`:
```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/feed");
}
```

- [ ] **Step 8: Verify layout renders**

1. Start dev server
2. Login, see navbar with coin counter, sidebar with nav items, main content area
3. Navigation links work between pages

- [ ] **Step 9: Commit**

```bash
git add src/components/layout src/components/providers.tsx src/app/\(main\) src/app/page.tsx src/app/layout.tsx
git commit -m "feat: add main layout with navbar, sidebar, and auth context"
```

---

## Task 7: Bets Feature — Types, Utils, Hooks

**Files:**
- Create: `src/features/bets/types.ts`, `src/features/bets/utils.ts`
- Create: `src/features/bets/hooks/use-bets.ts`, `src/features/bets/hooks/use-bet.ts`, `src/features/bets/hooks/use-wager.ts`

- [ ] **Step 1: Create bet types**

Create `src/features/bets/types.ts`:
```ts
import type { Database } from "@/lib/supabase/database.types";

export type Bet = Database["public"]["Tables"]["bets"]["Row"] & {
  creator: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  wagers: {
    id: string;
    user_id: string;
    side: boolean;
    amount: number;
  }[];
};

export type Wager = Database["public"]["Tables"]["wagers"]["Row"];
```

- [ ] **Step 2: Create payout utility**

Create `src/features/bets/utils.ts`:
```ts
export function calculateOdds(wagers: { side: boolean; amount: number }[]) {
  const yesTotal = wagers
    .filter((w) => w.side === true)
    .reduce((sum, w) => sum + w.amount, 0);
  const noTotal = wagers
    .filter((w) => w.side === false)
    .reduce((sum, w) => sum + w.amount, 0);
  const pool = yesTotal + noTotal;

  return { yesTotal, noTotal, pool };
}

export function calculatePayout(
  wagers: { user_id: string; side: boolean; amount: number }[],
  winningSide: boolean
): Map<string, number> {
  const { yesTotal, noTotal, pool } = calculateOdds(wagers);
  const winningTotal = winningSide ? yesTotal : noTotal;
  const payouts = new Map<string, number>();

  if (winningTotal === 0) return payouts;

  for (const wager of wagers) {
    if (wager.side === winningSide) {
      const payout = Math.round((wager.amount / winningTotal) * pool);
      payouts.set(wager.user_id, payout);
    } else {
      payouts.set(wager.user_id, 0);
    }
  }

  return payouts;
}
```

- [ ] **Step 3: Create use-bets hook (feed + realtime)**

Create `src/features/bets/hooks/use-bets.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bet } from "../types";

export function useBets(status: "active" | "pending" | "resolved" = "active") {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchBets() {
    const { data } = await supabase
      .from("bets")
      .select(`
        *,
        creator:profiles!creator_id(id, username, avatar_url),
        wagers(id, user_id, side, amount)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false });

    setBets((data as Bet[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchBets();

    const channel = supabase
      .channel(`bets-${status}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bets" },
        () => fetchBets()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wagers" },
        () => fetchBets()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status]);

  return { bets, loading, refetch: fetchBets };
}
```

- [ ] **Step 4: Create use-bet hook (single bet + realtime)**

Create `src/features/bets/hooks/use-bet.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bet } from "../types";

export function useBet(id: string) {
  const [bet, setBet] = useState<Bet | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchBet() {
    const { data } = await supabase
      .from("bets")
      .select(`
        *,
        creator:profiles!creator_id(id, username, avatar_url),
        wagers(id, user_id, side, amount)
      `)
      .eq("id", id)
      .single();

    setBet(data as Bet | null);
    setLoading(false);
  }

  useEffect(() => {
    fetchBet();

    const channel = supabase
      .channel(`bet-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bets", filter: `id=eq.${id}` },
        () => fetchBet()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wagers", filter: `bet_id=eq.${id}` },
        () => fetchBet()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { bet, loading, refetch: fetchBet };
}
```

- [ ] **Step 5: Create use-wager hook (place wager mutation)**

Create `src/features/bets/hooks/use-wager.ts`:
```ts
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";

export function useWager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile, refreshProfile } = useAuth();
  const supabase = createClient();

  async function placeWager(betId: string, side: boolean, amount: number) {
    setError(null);
    setLoading(true);

    if (!profile) {
      setError("Giris yapmaniz gerekiyor");
      setLoading(false);
      return false;
    }

    if (profile.points < amount) {
      setError("Yeterli puaniniz yok");
      setLoading(false);
      return false;
    }

    // Insert wager
    const { error: wagerError } = await supabase.from("wagers").insert({
      bet_id: betId,
      user_id: profile.id,
      side,
      amount,
    });

    if (wagerError) {
      setError(wagerError.message.includes("unique")
        ? "Bu bahise zaten katildiniz"
        : wagerError.message
      );
      setLoading(false);
      return false;
    }

    // Deduct points
    const { error: pointsError } = await supabase
      .from("profiles")
      .update({ points: profile.points - amount })
      .eq("id", profile.id);

    if (pointsError) {
      setError("Puan dusulurken hata olustu");
      setLoading(false);
      return false;
    }

    await refreshProfile();
    setLoading(false);
    return true;
  }

  return { placeWager, loading, error };
}
```

- [ ] **Step 6: Commit**

```bash
git add src/features/bets
git commit -m "feat: add bets types, payout utils, and data hooks with realtime"
```

---

## Task 8: Bet Components & Pages

**Files:**
- Create: `src/features/bets/components/bet-card.tsx`, `src/features/bets/components/wager-form.tsx`, `src/features/bets/components/propose-bet-form.tsx`, `src/features/bets/components/bet-detail.tsx`
- Update: `src/app/(main)/feed/page.tsx`
- Create: `src/app/(main)/bet/[id]/page.tsx`, `src/app/(main)/propose/page.tsx`

- [ ] **Step 1: Create BetCard component**

Create `src/features/bets/components/bet-card.tsx`:
```tsx
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

export function BetCard({ bet }: BetCardProps) {
  const { yesTotal, noTotal, pool } = calculateOdds(bet.wagers);
  const participantCount = bet.wagers.length;

  return (
    <Link href={`/bet/${bet.id}`}>
      <PixelCard className="hover:border-arcade-yellow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <span className="font-pixel text-[10px] text-arcade-purple uppercase">
            {bet.category}
          </span>
          <Countdown deadline={bet.deadline} />
        </div>

        <h3 className="font-pixel text-xs text-arcade-text mb-4 leading-relaxed">
          {bet.title}
        </h3>

        <HpBar yesAmount={yesTotal} noAmount={noTotal} />

        <div className="flex justify-between items-center mt-3">
          <CoinCounter amount={pool} size="sm" />
          <span className="text-xs text-arcade-muted">
            {participantCount} oyuncu
          </span>
        </div>
      </PixelCard>
    </Link>
  );
}
```

- [ ] **Step 2: Create WagerForm component**

Create `src/features/bets/components/wager-form.tsx`:
```tsx
"use client";

import { useState } from "react";
import { PixelButton } from "@/components/ui/pixel-button";
import { useAuth } from "@/components/providers";
import { useWager } from "../hooks/use-wager";

interface WagerFormProps {
  betId: string;
  creatorId: string;
  minWager: number;
  maxWager: number;
  existingWager?: { side: boolean; amount: number } | null;
}

export function WagerForm({ betId, creatorId, minWager, maxWager, existingWager }: WagerFormProps) {
  const [side, setSide] = useState<boolean | null>(null);
  const [amount, setAmount] = useState(minWager);
  const { profile } = useAuth();
  const { placeWager, loading, error } = useWager();

  if (!profile) return null;

  if (profile.id === creatorId) {
    return (
      <div className="text-center py-4">
        <p className="font-pixel text-[10px] text-arcade-muted">
          KENDI BAHISINE KATILAMAZSIN
        </p>
      </div>
    );
  }

  if (existingWager) {
    return (
      <div className="text-center py-4">
        <p className="font-pixel text-[10px] text-arcade-green">
          {existingWager.side ? "EVET" : "HAYIR"} TARAFINA {existingWager.amount} PUAN YATIRDIN
        </p>
      </div>
    );
  }

  async function handleSubmit() {
    if (side === null) return;
    await placeWager(betId, side, amount);
  }

  return (
    <div className="border-2 border-arcade-border p-4">
      <h3 className="font-pixel text-[10px] text-arcade-yellow mb-4">BAHIS YAP</h3>

      <div className="flex gap-3 mb-4">
        <PixelButton
          variant="yes"
          size="lg"
          className={`flex-1 ${side === true ? "bg-arcade-green/20" : ""}`}
          onClick={() => setSide(true)}
        >
          EVET
        </PixelButton>
        <PixelButton
          variant="no"
          size="lg"
          className={`flex-1 ${side === false ? "bg-arcade-red/20" : ""}`}
          onClick={() => setSide(false)}
        >
          HAYIR
        </PixelButton>
      </div>

      {side !== null && (
        <>
          <div className="mb-4">
            <label className="font-pixel text-[10px] text-arcade-muted block mb-2">
              PUAN: {amount}
            </label>
            <input
              type="range"
              min={minWager}
              max={Math.min(maxWager, profile.points)}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-arcade-yellow"
            />
            <div className="flex justify-between text-[10px] text-arcade-muted mt-1">
              <span>{minWager}</span>
              <span>{Math.min(maxWager, profile.points)}</span>
            </div>
          </div>

          {error && (
            <p className="font-pixel text-[10px] text-arcade-red mb-2">{error}</p>
          )}

          <PixelButton
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "YUKLENIYOR..." : `INSERT ${amount} COIN`}
          </PixelButton>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create ProposeBetForm component**

Create `src/features/bets/components/propose-bet-form.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelInput } from "@/components/ui/pixel-input";
import { PixelCard } from "@/components/ui/pixel-card";
import { CATEGORIES } from "@/lib/constants";

export function ProposeBetForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("random");
  const [deadline, setDeadline] = useState("");
  const [resolveDate, setResolveDate] = useState("");
  const [minWager, setMinWager] = useState(1);
  const [maxWager, setMaxWager] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    setLoading(true);

    const { error } = await supabase.from("bets").insert({
      creator_id: profile.id,
      title,
      description: description || null,
      category,
      deadline: new Date(deadline).toISOString(),
      resolve_date: resolveDate ? new Date(resolveDate).toISOString() : null,
      min_wager: minWager,
      max_wager: maxWager,
      status: "pending",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
  }

  return (
    <PixelCard>
      <h2 className="font-pixel text-sm text-arcade-green mb-6">YENI BAHIS ONER</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PixelInput
          label="Bahis Sorusu"
          placeholder="Ahmet yarin toplantiya gec kalir mi?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-arcade-muted uppercase">
            Aciklama (opsiyonel)
          </label>
          <textarea
            className="bg-arcade-bg border-2 border-arcade-border px-3 py-2 text-arcade-text font-body text-sm focus:border-arcade-yellow focus:outline-none placeholder:text-arcade-muted/50 min-h-[80px] resize-y"
            placeholder="Detaylar, kurallar, baglam..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-pixel text-[10px] text-arcade-muted uppercase">
            Kategori
          </label>
          <select
            className="bg-arcade-bg border-2 border-arcade-border px-3 py-2 text-arcade-text font-body text-sm focus:border-arcade-yellow focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PixelInput
            label="Bahis Kapanisi"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <PixelInput
            label="Sonuc Tarihi"
            type="datetime-local"
            value={resolveDate}
            onChange={(e) => setResolveDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PixelInput
            label="Min Bahis"
            type="number"
            min={1}
            value={minWager}
            onChange={(e) => setMinWager(Number(e.target.value))}
          />
          <PixelInput
            label="Max Bahis"
            type="number"
            min={1}
            value={maxWager}
            onChange={(e) => setMaxWager(Number(e.target.value))}
          />
        </div>

        {error && (
          <p className="font-pixel text-[10px] text-arcade-red">{error}</p>
        )}

        <PixelButton type="submit" disabled={loading} className="w-full mt-2">
          {loading ? "GONDERILIYOR..." : "INSERT COIN — ONER"}
        </PixelButton>
      </form>
    </PixelCard>
  );
}
```

- [ ] **Step 4: Create BetDetail component**

Create `src/features/bets/components/bet-detail.tsx`:
```tsx
"use client";

import { PixelCard } from "@/components/ui/pixel-card";
import { HpBar } from "@/components/ui/hp-bar";
import { Countdown } from "@/components/ui/countdown";
import { CoinCounter } from "@/components/ui/coin-counter";
import { WagerForm } from "./wager-form";
import { useAuth } from "@/components/providers";
import { calculateOdds } from "../utils";
import type { Bet } from "../types";

interface BetDetailProps {
  bet: Bet;
}

export function BetDetail({ bet }: BetDetailProps) {
  const { profile } = useAuth();
  const { yesTotal, noTotal, pool } = calculateOdds(bet.wagers);
  const isActive = bet.status === "active";
  const isResolved = bet.status === "resolved";

  const userWager = profile
    ? bet.wagers.find((w) => w.user_id === profile.id) ?? null
    : null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <PixelCard>
        <div className="flex justify-between items-start mb-2">
          <span className="font-pixel text-[10px] text-arcade-purple uppercase">
            {bet.category}
          </span>
          {isActive && <Countdown deadline={bet.deadline} />}
          {isResolved && (
            <span className="font-pixel text-[10px] text-arcade-green">
              SONUCLANDI: {bet.resolution ? "EVET" : "HAYIR"}
            </span>
          )}
        </div>

        <h1 className="font-pixel text-sm text-arcade-text mb-2 leading-relaxed">
          {bet.title}
        </h1>

        {bet.description && (
          <p className="text-sm text-arcade-muted mb-4">{bet.description}</p>
        )}

        <p className="text-xs text-arcade-muted mb-4">
          Oneren: {bet.creator.username}
        </p>

        <HpBar yesAmount={yesTotal} noAmount={noTotal} />

        <div className="flex justify-between items-center mt-3">
          <CoinCounter amount={pool} />
          <span className="text-sm text-arcade-muted">
            {bet.wagers.length} oyuncu
          </span>
        </div>
      </PixelCard>

      {isActive && (
        <WagerForm
          betId={bet.id}
          creatorId={bet.creator_id}
          minWager={bet.min_wager}
          maxWager={bet.max_wager}
          existingWager={userWager ? { side: userWager.side, amount: userWager.amount } : null}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Update Feed page**

Replace `src/app/(main)/feed/page.tsx`:
```tsx
"use client";

import { useBets } from "@/features/bets/hooks/use-bets";
import { BetCard } from "@/features/bets/components/bet-card";

export default function FeedPage() {
  const { bets, loading } = useBets("active");

  return (
    <div>
      <h1 className="font-pixel text-lg text-arcade-yellow mb-6">AKTIF BAHISLER</h1>

      {loading && (
        <p className="font-pixel text-[10px] text-arcade-muted animate-pulse">
          YUKLENIYOR...
        </p>
      )}

      {!loading && bets.length === 0 && (
        <p className="text-arcade-muted">Henuz aktif bahis yok. Ilk bahsi sen oner!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bets.map((bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create Bet Detail page**

Create `src/app/(main)/bet/[id]/page.tsx`:
```tsx
"use client";

import { use } from "react";
import { useBet } from "@/features/bets/hooks/use-bet";
import { BetDetail } from "@/features/bets/components/bet-detail";

export default function BetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { bet, loading } = useBet(id);

  if (loading) {
    return (
      <p className="font-pixel text-[10px] text-arcade-muted animate-pulse">
        YUKLENIYOR...
      </p>
    );
  }

  if (!bet) {
    return (
      <p className="font-pixel text-sm text-arcade-red">BAHIS BULUNAMADI</p>
    );
  }

  return <BetDetail bet={bet} />;
}
```

- [ ] **Step 7: Create Propose page**

Create `src/app/(main)/propose/page.tsx`:
```tsx
import { ProposeBetForm } from "@/features/bets/components/propose-bet-form";

export default function ProposePage() {
  return (
    <div className="max-w-lg mx-auto">
      <ProposeBetForm />
    </div>
  );
}
```

- [ ] **Step 8: Verify full bet flow**

1. Register a user, propose a bet
2. Check Supabase Table Editor — bet appears with status "pending"
3. Feed shows no active bets (correct — needs admin approval)

- [ ] **Step 9: Commit**

```bash
git add src/features/bets/components src/app/\(main\)
git commit -m "feat: add bet cards, detail, wager form, propose form, and pages"
```

---

## Task 9: Admin Panel

**Files:**
- Create: `src/app/(main)/admin/page.tsx`
- Create: `src/app/api/resolve-bet/route.ts`

- [ ] **Step 1: Create Admin page**

Create `src/app/(main)/admin/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { useBets } from "@/features/bets/hooks/use-bets";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelCard } from "@/components/ui/pixel-card";

export default function AdminPage() {
  const { profile } = useAuth();
  const { bets: pendingBets, refetch: refetchPending } = useBets("pending");
  const { bets: activeBets, refetch: refetchActive } = useBets("active");
  const [resolving, setResolving] = useState<string | null>(null);
  const supabase = createClient();

  if (profile?.role !== "admin") {
    return (
      <p className="font-pixel text-sm text-arcade-red">ERISIM ENGELLENDI</p>
    );
  }

  async function approveBet(betId: string) {
    await supabase.from("bets").update({ status: "active" }).eq("id", betId);
    refetchPending();
  }

  async function rejectBet(betId: string) {
    await supabase.from("bets").update({ status: "cancelled" }).eq("id", betId);
    refetchPending();
  }

  async function resolveBet(betId: string, resolution: boolean) {
    setResolving(betId);
    await fetch("/api/resolve-bet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ betId, resolution }),
    });
    setResolving(null);
    refetchActive();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-pixel text-lg text-arcade-yellow mb-4">ADMIN PANEL</h1>
      </div>

      {/* Pending Bets */}
      <section>
        <h2 className="font-pixel text-sm text-arcade-purple mb-4">
          ONAY BEKLEYENLER ({pendingBets.length})
        </h2>
        {pendingBets.length === 0 && (
          <p className="text-sm text-arcade-muted">Onay bekleyen bahis yok.</p>
        )}
        <div className="flex flex-col gap-3">
          {pendingBets.map((bet) => (
            <PixelCard key={bet.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-pixel text-xs text-arcade-text mb-1">
                    {bet.title}
                  </h3>
                  <p className="text-xs text-arcade-muted">
                    Oneren: {bet.creator.username}
                  </p>
                  {bet.description && (
                    <p className="text-xs text-arcade-muted mt-1">{bet.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <PixelButton
                    variant="yes"
                    size="sm"
                    onClick={() => approveBet(bet.id)}
                  >
                    ONAYLA
                  </PixelButton>
                  <PixelButton
                    variant="danger"
                    size="sm"
                    onClick={() => rejectBet(bet.id)}
                  >
                    REDDET
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      </section>

      {/* Active Bets — Resolve */}
      <section>
        <h2 className="font-pixel text-sm text-arcade-green mb-4">
          SONUCLANDIR ({activeBets.length})
        </h2>
        {activeBets.length === 0 && (
          <p className="text-sm text-arcade-muted">Aktif bahis yok.</p>
        )}
        <div className="flex flex-col gap-3">
          {activeBets.map((bet) => (
            <PixelCard key={bet.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-pixel text-xs text-arcade-text mb-1">
                    {bet.title}
                  </h3>
                  <p className="text-xs text-arcade-muted">
                    {bet.wagers.length} oyuncu — Havuz:{" "}
                    {bet.wagers.reduce((s, w) => s + w.amount, 0)} puan
                  </p>
                </div>
                <div className="flex gap-2">
                  <PixelButton
                    variant="yes"
                    size="sm"
                    disabled={resolving === bet.id}
                    onClick={() => resolveBet(bet.id, true)}
                  >
                    EVET KAZANDI
                  </PixelButton>
                  <PixelButton
                    variant="no"
                    size="sm"
                    disabled={resolving === bet.id}
                    onClick={() => resolveBet(bet.id, false)}
                  >
                    HAYIR KAZANDI
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Create resolve-bet API route**

Create `src/app/api/resolve-bet/route.ts`:
```ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { calculatePayout } from "@/features/bets/utils";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { betId, resolution } = await request.json();

  // Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get all wagers for this bet
  const { data: wagers } = await supabase
    .from("wagers")
    .select("id, user_id, side, amount")
    .eq("bet_id", betId);

  if (!wagers || wagers.length === 0) {
    // No wagers — just resolve
    await supabase
      .from("bets")
      .update({ status: "resolved", resolution, resolved_by: user.id })
      .eq("id", betId);

    return NextResponse.json({ success: true });
  }

  // Calculate payouts
  const payouts = calculatePayout(wagers, resolution);

  // Update each wager with payout and adjust user points
  for (const wager of wagers) {
    const payout = payouts.get(wager.user_id) ?? 0;

    // Update wager payout
    await supabase
      .from("wagers")
      .update({ payout })
      .eq("id", wager.id);

    // Update user points: add payout (winners get pool share, losers get 0)
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("points, total_wins, total_losses")
      .eq("id", wager.user_id)
      .single();

    if (userProfile) {
      const won = wager.side === resolution;
      await supabase
        .from("profiles")
        .update({
          points: userProfile.points + payout,
          total_wins: userProfile.total_wins + (won ? 1 : 0),
          total_losses: userProfile.total_losses + (won ? 0 : 1),
        })
        .eq("id", wager.user_id);

      // Create notification
      await supabase.from("notifications").insert({
        user_id: wager.user_id,
        type: "bet_resolved",
        title: won ? "KAZANDIN!" : "KAYBETTIN!",
        message: won
          ? `${payout} puan kazandin!`
          : `${wager.amount} puan kaybettin.`,
        bet_id: betId,
      });
    }
  }

  // Mark bet as resolved
  await supabase
    .from("bets")
    .update({ status: "resolved", resolution, resolved_by: user.id })
    .eq("id", betId);

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Verify admin flow**

1. Login as first user (admin)
2. Go to `/admin` — see pending bets
3. Approve a bet — it moves to active
4. Resolve a bet — payouts distributed, notifications created

- [ ] **Step 4: Commit**

```bash
git add src/app/\(main\)/admin src/app/api/resolve-bet
git commit -m "feat: add admin panel with bet approval and resolution with payout distribution"
```

---

## Task 10: Reactions & Comments

**Files:**
- Create: `src/features/reactions/types.ts`, `src/features/reactions/components/reaction-bar.tsx`, `src/features/reactions/components/comment-list.tsx`
- Create: `src/features/reactions/hooks/use-reactions.ts`, `src/features/reactions/hooks/use-comments.ts`
- Modify: `src/features/bets/components/bet-detail.tsx`

- [ ] **Step 1: Create reaction types**

Create `src/features/reactions/types.ts`:
```ts
import type { Database } from "@/lib/supabase/database.types";

export type Reaction = Database["public"]["Tables"]["reactions"]["Row"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
};
```

- [ ] **Step 2: Create use-reactions hook**

Create `src/features/reactions/hooks/use-reactions.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Reaction } from "../types";

export function useReactions(betId: string) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const supabase = createClient();

  async function fetchReactions() {
    const { data } = await supabase
      .from("reactions")
      .select("*")
      .eq("bet_id", betId);
    setReactions(data ?? []);
  }

  async function toggleReaction(emoji: string, userId: string) {
    const existing = reactions.find(
      (r) => r.emoji === emoji && r.user_id === userId
    );

    if (existing) {
      await supabase.from("reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("reactions").insert({
        bet_id: betId,
        user_id: userId,
        emoji,
      });
    }
  }

  useEffect(() => {
    fetchReactions();

    const channel = supabase
      .channel(`reactions-${betId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reactions", filter: `bet_id=eq.${betId}` },
        () => fetchReactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [betId]);

  return { reactions, toggleReaction };
}
```

- [ ] **Step 3: Create use-comments hook**

Create `src/features/reactions/hooks/use-comments.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "../types";

export function useComments(betId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const supabase = createClient();

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*, user:profiles!user_id(id, username, avatar_url)")
      .eq("bet_id", betId)
      .order("created_at", { ascending: true });
    setComments((data as Comment[]) ?? []);
  }

  async function addComment(userId: string, content: string) {
    await supabase.from("comments").insert({
      bet_id: betId,
      user_id: userId,
      content,
    });
  }

  async function deleteComment(commentId: string) {
    await supabase.from("comments").delete().eq("id", commentId);
  }

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments-${betId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `bet_id=eq.${betId}` },
        () => fetchComments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [betId]);

  return { comments, addComment, deleteComment };
}
```

- [ ] **Step 4: Create ReactionBar component**

Create `src/features/reactions/components/reaction-bar.tsx`:
```tsx
"use client";

import { useAuth } from "@/components/providers";
import { useReactions } from "../hooks/use-reactions";
import { REACTION_EMOJIS } from "@/lib/constants";

interface ReactionBarProps {
  betId: string;
}

export function ReactionBar({ betId }: ReactionBarProps) {
  const { profile } = useAuth();
  const { reactions, toggleReaction } = useReactions(betId);

  const counts = REACTION_EMOJIS.reduce((acc, emoji) => {
    acc[emoji] = reactions.filter((r) => r.emoji === emoji).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_EMOJIS.map((emoji) => {
        const isActive = profile
          ? reactions.some((r) => r.emoji === emoji && r.user_id === profile.id)
          : false;

        return (
          <button
            key={emoji}
            onClick={() => profile && toggleReaction(emoji, profile.id)}
            className={`
              px-2 py-1 border text-sm transition-all
              ${isActive
                ? "border-arcade-yellow bg-arcade-yellow/10"
                : "border-arcade-border hover:border-arcade-muted"
              }
            `}
          >
            {emoji} {counts[emoji] > 0 && <span className="text-xs text-arcade-muted">{counts[emoji]}</span>}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Create CommentList component**

Create `src/features/reactions/components/comment-list.tsx`:
```tsx
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useAuth } from "@/components/providers";
import { useComments } from "../hooks/use-comments";
import { PixelButton } from "@/components/ui/pixel-button";

interface CommentListProps {
  betId: string;
}

export function CommentList({ betId }: CommentListProps) {
  const { profile } = useAuth();
  const { comments, addComment, deleteComment } = useComments(betId);
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !content.trim()) return;
    await addComment(profile.id, content.trim());
    setContent("");
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-pixel text-[10px] text-arcade-yellow">
        YORUMLAR ({comments.length})
      </h3>

      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex justify-between items-start border-b border-arcade-border pb-2">
            <div>
              <span className="text-xs text-arcade-purple font-medium">
                {comment.user.username}
              </span>
              <span className="text-[10px] text-arcade-muted ml-2">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: tr,
                })}
              </span>
              <p className="text-sm text-arcade-text mt-1">{comment.content}</p>
            </div>
            {profile?.id === comment.user_id && (
              <button
                onClick={() => deleteComment(comment.id)}
                className="text-[10px] text-arcade-red hover:underline"
              >
                SIL
              </button>
            )}
          </div>
        ))}
      </div>

      {profile && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 bg-arcade-bg border-2 border-arcade-border px-3 py-2 text-sm text-arcade-text focus:border-arcade-yellow focus:outline-none"
            placeholder="Yorum yaz..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <PixelButton type="submit" size="sm" disabled={!content.trim()}>
            GONDER
          </PixelButton>
        </form>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Integrate reactions and comments into BetDetail**

Update `src/features/bets/components/bet-detail.tsx` — add at the end of the component, after the WagerForm section:

Add imports at top:
```tsx
import { ReactionBar } from "@/features/reactions/components/reaction-bar";
import { CommentList } from "@/features/reactions/components/comment-list";
```

Add after the `{isActive && <WagerForm ... />}` block, before the closing `</div>`:
```tsx
      <PixelCard>
        <ReactionBar betId={bet.id} />
      </PixelCard>

      <PixelCard>
        <CommentList betId={bet.id} />
      </PixelCard>
```

- [ ] **Step 7: Commit**

```bash
git add src/features/reactions src/features/bets/components/bet-detail.tsx
git commit -m "feat: add emoji reactions and comments with realtime updates"
```

---

## Task 11: Leaderboard

**Files:**
- Create: `src/features/leaderboard/types.ts`, `src/features/leaderboard/hooks/use-leaderboard.ts`, `src/features/leaderboard/components/leaderboard-table.tsx`
- Update: `src/app/(main)/leaderboard/page.tsx`

- [ ] **Step 1: Create leaderboard types**

Create `src/features/leaderboard/types.ts`:
```ts
export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  points: number;
  total_wins: number;
  total_losses: number;
  rank: number;
}
```

- [ ] **Step 2: Create use-leaderboard hook**

Create `src/features/leaderboard/hooks/use-leaderboard.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "../types";

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, points, total_wins, total_losses")
      .order("points", { ascending: false });

    const ranked = (data ?? []).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    setEntries(ranked);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return { entries, loading, refetch: fetchLeaderboard };
}
```

- [ ] **Step 3: Create LeaderboardTable component**

Create `src/features/leaderboard/components/leaderboard-table.tsx`:
```tsx
"use client";

import Link from "next/link";
import { CoinCounter } from "@/components/ui/coin-counter";
import type { LeaderboardEntry } from "../types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const RANK_STYLES: Record<number, string> = {
  1: "text-arcade-yellow",
  2: "text-arcade-muted",
  3: "text-amber-600",
};

const RANK_ICONS: Record<number, string> = {
  1: "👑",
  2: "🥈",
  3: "🥉",
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="border-2 border-arcade-border">
      {/* Header */}
      <div className="grid grid-cols-[60px_1fr_100px_80px_80px] gap-2 px-4 py-3 border-b-2 border-arcade-border bg-arcade-card">
        <span className="font-pixel text-[10px] text-arcade-muted">#</span>
        <span className="font-pixel text-[10px] text-arcade-muted">OYUNCU</span>
        <span className="font-pixel text-[10px] text-arcade-muted text-right">PUAN</span>
        <span className="font-pixel text-[10px] text-arcade-muted text-right">W</span>
        <span className="font-pixel text-[10px] text-arcade-muted text-right">L</span>
      </div>

      {/* Rows */}
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`/profile/${entry.id}`}
          className="grid grid-cols-[60px_1fr_100px_80px_80px] gap-2 px-4 py-3 border-b border-arcade-border hover:bg-arcade-card/50 transition-colors"
        >
          <span className={`font-pixel text-sm ${RANK_STYLES[entry.rank] ?? "text-arcade-muted"}`}>
            {RANK_ICONS[entry.rank] ?? entry.rank}
          </span>
          <span className="text-sm text-arcade-text">{entry.username}</span>
          <span className="text-right">
            <CoinCounter amount={entry.points} size="sm" />
          </span>
          <span className="text-sm text-arcade-green text-right">{entry.total_wins}</span>
          <span className="text-sm text-arcade-red text-right">{entry.total_losses}</span>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create Leaderboard page**

Create `src/app/(main)/leaderboard/page.tsx`:
```tsx
"use client";

import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";

export default function LeaderboardPage() {
  const { entries, loading } = useLeaderboard();

  return (
    <div>
      <h1 className="font-pixel text-lg text-arcade-yellow mb-6">HIGH SCORES</h1>

      {loading ? (
        <p className="font-pixel text-[10px] text-arcade-muted animate-pulse">
          YUKLENIYOR...
        </p>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/features/leaderboard src/app/\(main\)/leaderboard
git commit -m "feat: add arcade-style leaderboard with rankings"
```

---

## Task 12: User Profile

**Files:**
- Create: `src/features/users/types.ts`, `src/features/users/hooks/use-profile.ts`, `src/features/users/components/user-profile.tsx`, `src/features/users/components/avatar-picker.tsx`
- Create: `src/app/(main)/profile/[id]/page.tsx`

- [ ] **Step 1: Create user types**

Create `src/features/users/types.ts`:
```ts
import type { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
```

- [ ] **Step 2: Create use-profile hook**

Create `src/features/users/hooks/use-profile.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "../types";

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data);
    setLoading(false);
  }

  async function updateAvatar(avatarUrl: string) {
    await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId);
    await fetchProfile();
  }

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return { profile, loading, updateAvatar };
}
```

- [ ] **Step 3: Create AvatarPicker component**

Create `src/features/users/components/avatar-picker.tsx`:
```tsx
"use client";

import { AVATARS } from "@/lib/constants";

interface AvatarPickerProps {
  selected: string | null;
  onSelect: (url: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {AVATARS.map((url) => (
        <button
          key={url}
          onClick={() => onSelect(url)}
          className={`
            w-12 h-12 border-2 flex items-center justify-center text-2xl
            transition-all
            ${selected === url
              ? "border-arcade-yellow bg-arcade-yellow/10"
              : "border-arcade-border hover:border-arcade-muted"
            }
          `}
        >
          <div className="w-10 h-10 bg-arcade-purple/20 flex items-center justify-center font-pixel text-[8px] text-arcade-muted">
            {url.split("-").pop()?.replace(".png", "")}
          </div>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create UserProfile component**

Create `src/features/users/components/user-profile.tsx`:
```tsx
"use client";

import { PixelCard } from "@/components/ui/pixel-card";
import { CoinCounter } from "@/components/ui/coin-counter";
import { useAuth } from "@/components/providers";
import { AvatarPicker } from "./avatar-picker";
import type { Profile } from "../types";

interface UserProfileProps {
  profile: Profile;
  onUpdateAvatar?: (url: string) => void;
}

export function UserProfile({ profile, onUpdateAvatar }: UserProfileProps) {
  const { profile: currentUser } = useAuth();
  const isOwn = currentUser?.id === profile.id;
  const winRate =
    profile.total_wins + profile.total_losses > 0
      ? Math.round(
          (profile.total_wins / (profile.total_wins + profile.total_losses)) * 100
        )
      : 0;

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <PixelCard>
        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto mb-3 border-2 border-arcade-yellow bg-arcade-purple/20 flex items-center justify-center">
            <span className="font-pixel text-2xl text-arcade-yellow">
              {profile.username[0].toUpperCase()}
            </span>
          </div>
          <h1 className="font-pixel text-sm text-arcade-text">{profile.username}</h1>
          {profile.role === "admin" && (
            <span className="font-pixel text-[10px] text-arcade-purple">ADMIN</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <CoinCounter amount={profile.points} size="lg" />
            <p className="font-pixel text-[8px] text-arcade-muted mt-1">PUAN</p>
          </div>
          <div>
            <p className="font-pixel text-sm text-arcade-green">{profile.total_wins}</p>
            <p className="font-pixel text-[8px] text-arcade-muted mt-1">KAZANMA</p>
          </div>
          <div>
            <p className="font-pixel text-sm text-arcade-red">{profile.total_losses}</p>
            <p className="font-pixel text-[8px] text-arcade-muted mt-1">KAYBETME</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-arcade-muted">
            Kazanma orani: <span className="text-arcade-yellow">{winRate}%</span>
          </p>
        </div>
      </PixelCard>

      {isOwn && onUpdateAvatar && (
        <PixelCard>
          <h2 className="font-pixel text-[10px] text-arcade-yellow mb-3">AVATAR SEC</h2>
          <AvatarPicker
            selected={profile.avatar_url}
            onSelect={onUpdateAvatar}
          />
        </PixelCard>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create Profile page**

Create `src/app/(main)/profile/[id]/page.tsx`:
```tsx
"use client";

import { use } from "react";
import { useProfile } from "@/features/users/hooks/use-profile";
import { UserProfile } from "@/features/users/components/user-profile";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { profile, loading, updateAvatar } = useProfile(id);

  if (loading) {
    return (
      <p className="font-pixel text-[10px] text-arcade-muted animate-pulse">
        YUKLENIYOR...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="font-pixel text-sm text-arcade-red">OYUNCU BULUNAMADI</p>
    );
  }

  return <UserProfile profile={profile} onUpdateAvatar={updateAvatar} />;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/features/users src/app/\(main\)/profile
git commit -m "feat: add user profile page with stats and avatar picker"
```

---

## Task 13: Badges System

**Files:**
- Create: `src/features/badges/types.ts`, `src/features/badges/hooks/use-badges.ts`, `src/features/badges/components/badge-display.tsx`, `src/features/badges/components/badge-collection.tsx`
- Modify: `src/features/users/components/user-profile.tsx`

- [ ] **Step 1: Create badge types**

Create `src/features/badges/types.ts`:
```ts
import type { Database } from "@/lib/supabase/database.types";

export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"] & {
  badge: Badge;
};
```

- [ ] **Step 2: Create use-badges hook**

Create `src/features/badges/hooks/use-badges.ts`:
```ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserBadge } from "../types";

export function useBadges(userId: string) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchBadges() {
    const { data } = await supabase
      .from("user_badges")
      .select("*, badge:badges(*)")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    setBadges((data as UserBadge[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  return { badges, loading };
}
```

- [ ] **Step 3: Create BadgeDisplay component**

Create `src/features/badges/components/badge-display.tsx`:
```tsx
import type { Badge } from "../types";

interface BadgeDisplayProps {
  badge: Badge;
  earned?: boolean;
}

export function BadgeDisplay({ badge, earned = true }: BadgeDisplayProps) {
  return (
    <div
      className={`
        relative group flex flex-col items-center gap-1 p-2 border-2 transition-all
        ${earned
          ? "border-arcade-purple bg-arcade-purple/10"
          : "border-arcade-border opacity-40"
        }
      `}
    >
      <div className="w-10 h-10 flex items-center justify-center font-pixel text-lg">
        {badge.icon.includes("/") ? "🏆" : badge.icon}
      </div>
      <span className="font-pixel text-[8px] text-arcade-text text-center">
        {badge.name}
      </span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-arcade-bg border border-arcade-border text-[10px] text-arcade-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {badge.description}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create BadgeCollection component**

Create `src/features/badges/components/badge-collection.tsx`:
```tsx
"use client";

import { PixelCard } from "@/components/ui/pixel-card";
import { BadgeDisplay } from "./badge-display";
import { useBadges } from "../hooks/use-badges";

interface BadgeCollectionProps {
  userId: string;
}

export function BadgeCollection({ userId }: BadgeCollectionProps) {
  const { badges, loading } = useBadges(userId);

  if (loading) return null;
  if (badges.length === 0) {
    return (
      <PixelCard>
        <h2 className="font-pixel text-[10px] text-arcade-yellow mb-3">ROZETLER</h2>
        <p className="text-xs text-arcade-muted">Henuz rozet kazanilmamis.</p>
      </PixelCard>
    );
  }

  return (
    <PixelCard>
      <h2 className="font-pixel text-[10px] text-arcade-yellow mb-3">ROZETLER</h2>
      <div className="grid grid-cols-4 gap-2">
        {badges.map((ub) => (
          <BadgeDisplay key={ub.id} badge={ub.badge} earned />
        ))}
      </div>
    </PixelCard>
  );
}
```

- [ ] **Step 5: Add BadgeCollection to UserProfile**

Update `src/features/users/components/user-profile.tsx` — add import:
```tsx
import { BadgeCollection } from "@/features/badges/components/badge-collection";
```

Add after the avatar picker section, before the final closing `</div>`:
```tsx
      <BadgeCollection userId={profile.id} />
```

- [ ] **Step 6: Commit**

```bash
git add src/features/badges src/features/users/components/user-profile.tsx
git commit -m "feat: add badge system with collection display on profiles"
```

---

## Task 14: Notifications

**Files:**
- Create: `src/features/notifications/types.ts`, `src/features/notifications/hooks/use-notifications.ts`, `src/features/notifications/components/notification-toast.tsx`
- Modify: `src/components/layout/navbar.tsx`

- [ ] **Step 1: Create notification types**

Create `src/features/notifications/types.ts`:
```ts
import type { Database } from "@/lib/supabase/database.types";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
```

- [ ] **Step 2: Create use-notifications hook**

Create `src/features/notifications/hooks/use-notifications.ts`:
```ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import type { Notification } from "../types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile } = useAuth();
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    if (!profile) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const notifs = data ?? [];
    setNotifications(notifs);
    setUnreadCount(notifs.filter((n) => !n.read).length);
  }, [profile?.id]);

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function markAllAsRead() {
    if (!profile) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", profile.id)
      .eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  useEffect(() => {
    fetchNotifications();

    if (!profile) return;

    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, fetchNotifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
```

- [ ] **Step 3: Create NotificationToast component**

Create `src/features/notifications/components/notification-toast.tsx`:
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useNotifications } from "../hooks/use-notifications";
import { PixelButton } from "@/components/ui/pixel-button";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-arcade-muted hover:text-arcade-text transition-colors"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-arcade-red text-[8px] font-pixel text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-arcade-card border-2 border-arcade-border z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center p-3 border-b border-arcade-border">
            <span className="font-pixel text-[10px] text-arcade-yellow">
              BILDIRIMLER
            </span>
            {unreadCount > 0 && (
              <PixelButton
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
              >
                TUMUNU OKU
              </PixelButton>
            )}
          </div>

          {notifications.length === 0 && (
            <p className="p-4 text-xs text-arcade-muted text-center">
              Bildirim yok.
            </p>
          )}

          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && markAsRead(notif.id)}
              className={`
                p-3 border-b border-arcade-border cursor-pointer transition-colors
                ${notif.read ? "opacity-60" : "bg-arcade-bg/30"}
                hover:bg-arcade-bg/50
              `}
            >
              <div className="flex justify-between">
                <span className="font-pixel text-[10px] text-arcade-text">
                  {notif.title}
                </span>
                <span className="text-[10px] text-arcade-muted">
                  {formatDistanceToNow(new Date(notif.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
              <p className="text-xs text-arcade-muted mt-1">{notif.message}</p>
              {notif.bet_id && (
                <Link
                  href={`/bet/${notif.bet_id}`}
                  className="text-[10px] text-arcade-purple hover:underline mt-1 inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  Bahise git →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Add NotificationBell to Navbar**

Update `src/components/layout/navbar.tsx` — add import:
```tsx
import { NotificationBell } from "@/features/notifications/components/notification-toast";
```

Add `<NotificationBell />` in the navbar, right before the CoinCounter:
```tsx
            <NotificationBell />
            <CoinCounter amount={profile.points} />
```

- [ ] **Step 5: Commit**

```bash
git add src/features/notifications src/components/layout/navbar.tsx
git commit -m "feat: add notification system with realtime bell and dropdown"
```

---

## Task 15: Sound Effects

**Files:**
- Create: `src/lib/sounds.ts`
- Modify: `src/components/providers.tsx`

- [ ] **Step 1: Create sound manager**

Create `src/lib/sounds.ts`:
```ts
type SoundName = "coin" | "win" | "lose" | "levelup" | "blip";

const SOUND_FILES: Record<SoundName, string> = {
  coin: "/sounds/coin.mp3",
  win: "/sounds/win.mp3",
  lose: "/sounds/lose.mp3",
  levelup: "/sounds/levelup.mp3",
  blip: "/sounds/blip.mp3",
};

class SoundManager {
  private enabled = true;
  private cache = new Map<string, HTMLAudioElement>();

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  play(name: SoundName) {
    if (!this.enabled || typeof window === "undefined") return;

    let audio = this.cache.get(name);
    if (!audio) {
      audio = new Audio(SOUND_FILES[name]);
      audio.volume = 0.3;
      this.cache.set(name, audio);
    }

    audio.currentTime = 0;
    audio.play().catch(() => {
      // Autoplay blocked — ignore
    });
  }
}

export const sounds = new SoundManager();
```

- [ ] **Step 2: Add sound toggle to Navbar**

Update `src/components/layout/navbar.tsx` — add import:
```tsx
import { sounds } from "@/lib/sounds";
```

Add state and toggle button inside the Navbar component, before the logout button:
```tsx
const [soundOn, setSoundOn] = useState(true);

function toggleSound() {
  const enabled = sounds.toggle();
  setSoundOn(enabled);
}
```

Add button in JSX:
```tsx
            <button
              onClick={toggleSound}
              className="text-lg transition-opacity hover:opacity-80"
              title={soundOn ? "Sesi kapat" : "Sesi ac"}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/sounds.ts src/components/layout/navbar.tsx
git commit -m "feat: add sound effect manager with toggle"
```

Note: Actual `.mp3` files need to be added to `public/sounds/`. Free chiptune sounds can be sourced from opengameart.org or similar. For now the system gracefully handles missing files.

---

## Task 16: Final Polish & Smoke Test

**Files:**
- Modify: Various files for final integration

- [ ] **Step 1: Add .gitignore entries**

Ensure `.gitignore` includes:
```
.superpowers/
.env.local
```

- [ ] **Step 2: Smoke test the full flow**

1. Start dev server: `npm run dev`
2. Register first user (becomes admin)
3. Register second user
4. User 2: propose a bet
5. User 1 (admin): approve the bet in `/admin`
6. User 1: place a wager on the bet
7. User 2: cannot wager on own bet (correct)
8. Register user 3, place opposing wager
9. User 1 (admin): resolve the bet
10. Verify: points redistributed, notifications appear, leaderboard updates

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "feat: OffBet v1.0 — retro arcade office betting platform"
```
