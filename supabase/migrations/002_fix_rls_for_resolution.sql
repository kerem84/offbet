-- Fix RLS policies for bet resolution flow
-- Admin needs to: update wagers (payout), update profiles (points/stats), insert notifications

-- Allow admin to update wagers (for setting payout)
CREATE POLICY "wagers_admin_update"
  ON wagers FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admin to update any profile (for distributing points)
CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow authenticated users to insert notifications (for system notifications)
CREATE POLICY "notifications_authenticated_insert"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
