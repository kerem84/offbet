export function calculateOdds(wagers: { side: boolean; amount: number }[]) {
  const yesTotal = wagers.filter((w) => w.side === true).reduce((sum, w) => sum + w.amount, 0);
  const noTotal = wagers.filter((w) => w.side === false).reduce((sum, w) => sum + w.amount, 0);
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
