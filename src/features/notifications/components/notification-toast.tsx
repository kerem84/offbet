"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useNotifications } from "../hooks/use-notifications";
import { PixelButton } from "@/components/ui/pixel-button";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-8 h-8 text-arcade-text hover:text-arcade-yellow transition-colors"
        aria-label="Bildirimler"
      >
        <span className="text-base leading-none">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-arcade-red rounded-full font-pixel text-[8px] text-white leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-arcade-card border-2 border-arcade-border z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-arcade-border sticky top-0 bg-arcade-card">
            <span className="font-pixel text-[10px] text-arcade-yellow tracking-widest">
              BILDIRIMLER
            </span>
            {unreadCount > 0 && (
              <PixelButton
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[8px] py-0.5 px-2"
              >
                TUMUNU OKU
              </PixelButton>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <p className="font-pixel text-[9px] text-arcade-muted text-center py-6 tracking-wide">
              BILDIRIM YOK
            </p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => {
                    if (!n.read) markAsRead(n.id);
                  }}
                  className={`px-3 py-2.5 border-b border-arcade-border/40 cursor-pointer hover:bg-arcade-border/20 transition-colors ${
                    n.read ? "opacity-60" : "bg-arcade-bg/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <span className="font-pixel text-[10px] text-arcade-text leading-tight">
                      {n.title}
                    </span>
                    <span className="font-pixel text-[8px] text-arcade-muted whitespace-nowrap shrink-0">
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] text-arcade-muted leading-snug mb-1">
                    {n.message}
                  </p>
                  {n.bet_id && (
                    <Link
                      href={`/bet/${n.bet_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel text-[9px] text-arcade-yellow hover:opacity-80 transition-opacity"
                    >
                      Bahise git →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
