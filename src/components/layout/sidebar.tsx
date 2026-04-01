"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/feed", label: "BAHISLER", icon: "🎰" },
  { href: "/propose", label: "ONER", icon: "🎲" },
  { href: "/leaderboard", label: "SKOR", icon: "🏆" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-48 bg-arcade-card border-r-2 border-arcade-border z-40">
      <nav className="flex flex-col pt-4">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-4 py-3 font-pixel text-[10px] tracking-wide transition-colors",
                isActive
                  ? "text-arcade-yellow border-l-2 border-arcade-yellow bg-arcade-yellow/5"
                  : "text-arcade-muted hover:text-arcade-text border-l-2 border-transparent",
              ].join(" ")}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
