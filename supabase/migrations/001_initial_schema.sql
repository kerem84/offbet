-- ============================================================
-- 001_initial_schema.sql
-- Poly Market — Initial Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. Extensions
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ------------------------------------------------------------
-- 2. Enums
-- ------------------------------------------------------------
CREATE TYPE bet_status AS ENUM ('draft', 'pending', 'active', 'resolved', 'cancelled');


-- ------------------------------------------------------------
-- 3. Tables
-- ------------------------------------------------------------

-- profiles
CREATE TABLE profiles (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     text        UNIQUE NOT NULL,
  avatar_url   text,
  points       int         DEFAULT 100,
  total_wins   int         DEFAULT 0,
  total_losses int         DEFAULT 0,
  role         text        DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at   timestamptz DEFAULT now()
);

-- bets
CREATE TABLE bets (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id   uuid        REFERENCES profiles(id) ON DELETE CASCADE,
  title        text,
  description  text,
  category     text        DEFAULT 'random',
  status       bet_status  DEFAULT 'pending',
  resolution   boolean,
  resolved_by  uuid        REFERENCES profiles(id),
  min_wager    int         DEFAULT 1,
  max_wager    int         DEFAULT 10,
  deadline     timestamptz,
  resolve_date timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- wagers
CREATE TABLE wagers (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bet_id     uuid REFERENCES bets(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  side       boolean NOT NULL,
  amount     int CHECK (amount > 0),
  payout     int,
  created_at timestamptz DEFAULT now(),
  UNIQUE (bet_id, user_id)
);

-- reactions
CREATE TABLE reactions (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bet_id     uuid REFERENCES bets(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  emoji      text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (bet_id, user_id, emoji)
);

-- comments
CREATE TABLE comments (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bet_id     uuid REFERENCES bets(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content    text,
  created_at timestamptz DEFAULT now()
);

-- badges
CREATE TABLE badges (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             text UNIQUE,
  description      text,
  icon             text,
  condition_type   text,
  condition_value  int DEFAULT 0
);

-- user_badges
CREATE TABLE user_badges (
  id        uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   uuid        REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id  uuid        REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- notifications
CREATE TABLE notifications (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid        REFERENCES profiles(id) ON DELETE CASCADE,
  type       text,
  title      text,
  message    text,
  bet_id     uuid        REFERENCES bets(id) ON DELETE SET NULL,
  read       boolean     DEFAULT false,
  created_at timestamptz DEFAULT now()
);


-- ------------------------------------------------------------
-- 4. Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_bets_status      ON bets(status);
CREATE INDEX idx_bets_creator_id  ON bets(creator_id);
CREATE INDEX idx_bets_deadline    ON bets(deadline);
CREATE INDEX idx_wagers_bet_id    ON wagers(bet_id);
CREATE INDEX idx_wagers_user_id   ON wagers(user_id);
CREATE INDEX idx_comments_bet_id  ON comments(bet_id);
CREATE INDEX idx_reactions_bet_id ON reactions(bet_id);
CREATE INDEX idx_notifications_user_id       ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread   ON notifications(user_id) WHERE read = false;


-- ------------------------------------------------------------
-- 5. Row Level Security
-- ------------------------------------------------------------

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wagers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ── profiles ─────────────────────────────────────────────────
CREATE POLICY "profiles_public_read"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_user_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles_user_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ── bets ─────────────────────────────────────────────────────
CREATE POLICY "bets_public_read"
  ON bets FOR SELECT
  USING (true);

CREATE POLICY "bets_authenticated_insert"
  ON bets FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND creator_id = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY "bets_admin_update"
  ON bets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── wagers ────────────────────────────────────────────────────
CREATE POLICY "wagers_public_read"
  ON wagers FOR SELECT
  USING (true);

CREATE POLICY "wagers_user_insert_own"
  ON wagers FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (
      SELECT creator_id FROM bets WHERE id = bet_id
    ) != auth.uid()
  );

-- ── reactions ─────────────────────────────────────────────────
CREATE POLICY "reactions_public_read"
  ON reactions FOR SELECT
  USING (true);

CREATE POLICY "reactions_user_insert_own"
  ON reactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reactions_user_delete_own"
  ON reactions FOR DELETE
  USING (user_id = auth.uid());

-- ── comments ──────────────────────────────────────────────────
CREATE POLICY "comments_public_read"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "comments_user_insert_own"
  ON comments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments_user_delete_own"
  ON comments FOR DELETE
  USING (user_id = auth.uid());

-- ── badges ────────────────────────────────────────────────────
CREATE POLICY "badges_public_read"
  ON badges FOR SELECT
  USING (true);

-- ── user_badges ───────────────────────────────────────────────
CREATE POLICY "user_badges_public_read"
  ON user_badges FOR SELECT
  USING (true);

-- ── notifications ─────────────────────────────────────────────
CREATE POLICY "notifications_user_read_own"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_user_update_own"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());


-- ------------------------------------------------------------
-- 6. Trigger: auto-create profile on auth.users insert
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
  v_role     text;
  v_count    int;
BEGIN
  -- Determine role: first user ever becomes admin
  SELECT COUNT(*) INTO v_count FROM profiles;
  IF v_count = 0 THEN
    v_role := 'admin';
  ELSE
    v_role := 'user';
  END IF;

  -- Determine username: prefer raw_user_meta_data, fallback to email prefix
  v_username := NEW.raw_user_meta_data->>'username';
  IF v_username IS NULL OR v_username = '' THEN
    v_username := split_part(NEW.email, '@', 1);
  END IF;

  INSERT INTO profiles (id, username, role, created_at)
  VALUES (NEW.id, v_username, v_role, now());

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ------------------------------------------------------------
-- 7. Seed: Badges
-- ------------------------------------------------------------
INSERT INTO badges (name, description, icon, condition_type, condition_value) VALUES
  ('Ilk Kan',       'İlk galibiyetini kazandın',            '🩸', 'wins_count',       1),
  ('Kumarhane Krali','10 galibiyet kazandın',               '👑', 'wins_count',       10),
  ('Tam Kayip',     'Tüm puanlarını kaybettin',             '💀', 'zero_points',      0),
  ('Kahin',         '5 tur üst üste kazandın',              '🔮', 'streak',           5),
  ('Troll',         '10 bahis önerisi oluşturdun',          '🧌', 'proposals_count',  10),
  ('High Roller',   'Tek seferde 50 puan bahis oynadın',    '🎰', 'single_wager',     50),
  ('Survivor',      'En zorlu koşullarda hayatta kaldın',   '🏆', 'survivor',         0);


-- ------------------------------------------------------------
-- 8. Realtime
-- ------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE bets;
ALTER PUBLICATION supabase_realtime ADD TABLE wagers;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
