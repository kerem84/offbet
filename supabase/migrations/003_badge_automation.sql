-- ============================================================
-- 003_badge_automation.sql
-- Automatic badge awarding function
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Allow the function to insert into user_badges and notifications
-- (RLS bypass via SECURITY DEFINER)

CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile       RECORD;
  v_badge         RECORD;
  v_streak_count  int;
  v_proposal_count int;
  v_has_tam_kayip boolean;
  v_inserted      boolean;
BEGIN
  -- Fetch the user's current profile
  SELECT points, total_wins, total_losses
    INTO v_profile
    FROM profiles
   WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- ── Ilk Kan (wins_count >= 1) ──────────────────────────────
  IF v_profile.total_wins >= 1 THEN
    SELECT id INTO v_badge FROM badges WHERE condition_type = 'wins_count' AND condition_value = 1;
    IF FOUND THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING true INTO v_inserted;

      IF v_inserted THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (p_user_id, 'badge_earned', 'ROZET KAZANILDI!', '🩸 Ilk Kan rozeti kazandin!');
      END IF;
    END IF;
  END IF;

  -- ── Kumarhane Krali (wins_count >= 10) ─────────────────────
  IF v_profile.total_wins >= 10 THEN
    SELECT id INTO v_badge FROM badges WHERE condition_type = 'wins_count' AND condition_value = 10;
    IF FOUND THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING true INTO v_inserted;

      IF v_inserted THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (p_user_id, 'badge_earned', 'ROZET KAZANILDI!', '👑 Kumarhane Krali rozeti kazandin!');
      END IF;
    END IF;
  END IF;

  -- ── Tam Kayip (zero_points) ────────────────────────────────
  IF v_profile.points = 0 THEN
    SELECT id INTO v_badge FROM badges WHERE condition_type = 'zero_points';
    IF FOUND THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING true INTO v_inserted;

      IF v_inserted THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (p_user_id, 'badge_earned', 'ROZET KAZANILDI!', '💀 Tam Kayip rozeti kazandin!');
      END IF;
    END IF;
  END IF;

  -- ── Kahin (streak — last 5 resolved wagers all won) ────────
  SELECT COUNT(*) INTO v_streak_count
    FROM (
      SELECT w.payout
        FROM wagers w
        JOIN bets b ON b.id = w.bet_id
       WHERE w.user_id = p_user_id
         AND b.status = 'resolved'
         AND w.payout IS NOT NULL
       ORDER BY b.resolve_date DESC NULLS LAST, w.created_at DESC
       LIMIT 5
    ) sub
   WHERE sub.payout > 0;

  IF v_streak_count = 5 THEN
    SELECT id INTO v_badge FROM badges WHERE condition_type = 'streak';
    IF FOUND THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING true INTO v_inserted;

      IF v_inserted THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (p_user_id, 'badge_earned', 'ROZET KAZANILDI!', '🔮 Kahin rozeti kazandin!');
      END IF;
    END IF;
  END IF;

  -- ── Troll (proposals_count — 5+ approved bets created) ─────
  SELECT COUNT(*) INTO v_proposal_count
    FROM bets
   WHERE creator_id = p_user_id
     AND status IN ('active', 'resolved');

  IF v_proposal_count >= 5 THEN
    SELECT id INTO v_badge FROM badges WHERE condition_type = 'proposals_count';
    IF FOUND THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING true INTO v_inserted;

      IF v_inserted THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (p_user_id, 'badge_earned', 'ROZET KAZANILDI!', '🧌 Troll rozeti kazandin!');
      END IF;
    END IF;
  END IF;

  -- ── Survivor (had Tam Kayip badge AND now points > 0) ──────
  SELECT EXISTS (
    SELECT 1
      FROM user_badges ub
      JOIN badges b ON b.id = ub.badge_id
     WHERE ub.user_id = p_user_id
       AND b.condition_type = 'zero_points'
  ) INTO v_has_tam_kayip;

  IF v_has_tam_kayip AND v_profile.points > 0 THEN
    SELECT id INTO v_badge FROM badges WHERE condition_type = 'survivor';
    IF FOUND THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING true INTO v_inserted;

      IF v_inserted THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (p_user_id, 'badge_earned', 'ROZET KAZANILDI!', '🏆 Survivor rozeti kazandin!');
      END IF;
    END IF;
  END IF;

  -- Note: High Roller (single_wager >= 50) is checked separately
  -- at wager insertion time, not here, because we need the wager amount.

END;
$$;


-- ── High Roller standalone function ──────────────────────────
-- Called from the client after a wager is placed, passing the amount.

CREATE OR REPLACE FUNCTION check_high_roller(p_user_id uuid, p_amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_badge   RECORD;
  v_inserted boolean;
BEGIN
  IF p_amount >= 50 THEN
    SELECT id INTO v_badge FROM badges WHERE condition_type = 'single_wager';
    IF FOUND THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING
      RETURNING true INTO v_inserted;

      IF v_inserted THEN
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (p_user_id, 'badge_earned', 'ROZET KAZANILDI!', '🎰 High Roller rozeti kazandin!');
      END IF;
    END IF;
  END IF;
END;
$$;
