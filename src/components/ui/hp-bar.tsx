interface HpBarProps {
  yesAmount: number;
  noAmount: number;
}

function HpBar({ yesAmount, noAmount }: HpBarProps) {
  const total = yesAmount + noAmount;
  const yesPercent = total === 0 ? 50 : Math.round((yesAmount / total) * 100);
  const noPercent = total === 0 ? 50 : 100 - yesPercent;

  return (
    <div className="w-full space-y-1">
      {/* Labels */}
      <div className="flex justify-between">
        <span className="font-pixel text-[10px] text-arcade-green">EVET {yesPercent}%</span>
        <span className="font-pixel text-[10px] text-arcade-red">HAYIR {noPercent}%</span>
      </div>

      {/* Bar */}
      <div className="w-full h-4 bg-arcade-bg border border-arcade-border flex overflow-hidden">
        <div
          className="bg-arcade-green transition-all duration-500"
          style={{ width: `${yesPercent}%` }}
        />
        <div
          className="bg-arcade-red transition-all duration-500"
          style={{ width: `${noPercent}%` }}
        />
      </div>

      {/* Point counts */}
      <div className="flex justify-between">
        <span className="font-pixel text-[10px] text-arcade-muted">{yesAmount} puan</span>
        <span className="font-pixel text-[10px] text-arcade-muted">{noAmount} puan</span>
      </div>
    </div>
  );
}

export { HpBar };
