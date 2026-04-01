"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers";
import { sounds } from "@/lib/sounds";
import type { Notification } from "../types";

export function useNotifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!profile) return;

    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const items = (data as Notification[]) ?? [];
    setNotifications(items);
    setUnreadCount(items.filter((n) => !n.read).length);
  }, [profile]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!profile) return;

      const supabase = createClient();
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", profile.id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [profile]
  );

  const markAllAsRead = useCallback(async () => {
    if (!profile) return;

    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", profile.id)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [profile]);

  useEffect(() => {
    fetchNotifications();

    if (!profile) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
          if (!newNotif.read) {
            setUnreadCount((prev) => prev + 1);
            // Play sound based on notification type
            if (newNotif.title === "KAZANDIN!") {
              sounds.play("win");
            } else if (newNotif.title === "KAYBETTIN!") {
              sounds.play("lose");
            } else {
              sounds.play("blip");
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications, profile]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
