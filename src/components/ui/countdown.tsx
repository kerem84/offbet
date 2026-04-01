"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  deadline: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTimeLeft(deadline: string): TimeLeft {
  const diff = new Date(deadline).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function Countdown({ deadline }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(deadline));

  useEffect(() => {
    if (timeLeft.expired) return;

    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(deadline));
    }, 1000);

    return () => clearInterval(id);
  }, [deadline, timeLeft.expired]);

  if (timeLeft.expired) {
    return (
      <span className="font-pixel text-[10px] text-arcade-red animate-glow">SURESI DOLDU</span>
    );
  }

  return (
    <span className="font-pixel text-[10px] text-arcade-yellow">
      {timeLeft.days}g:{pad(timeLeft.hours)}s:{pad(timeLeft.minutes)}d:{pad(timeLeft.seconds)}s
    </span>
  );
}

export { Countdown };
