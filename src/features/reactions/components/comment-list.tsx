"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useAuth } from "@/components/providers";
import { PixelButton } from "@/components/ui/pixel-button";
import { useComments } from "../hooks/use-comments";
import { UserAvatar } from "@/components/ui/user-avatar";

interface CommentListProps {
  betId: string;
}

export function CommentList({ betId }: CommentListProps) {
  const { profile } = useAuth();
  const { comments, addComment, deleteComment } = useComments(betId);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !input.trim()) return;

    setSubmitting(true);
    await addComment(profile.id, input);
    setInput("");
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h3 className="font-pixel text-[10px] text-arcade-yellow uppercase">
        YORUMLAR ({comments.length})
      </h3>

      {/* Comment thread */}
      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="font-pixel text-[10px] text-arcade-muted">
            HENUZ YORUM YOK
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserAvatar
                  avatarUrl={comment.user.avatar_url}
                  username={comment.user.username}
                  size="sm"
                />
                <span className="font-pixel text-[10px] text-arcade-purple">
                  {comment.user.username}
                </span>
                <span className="font-pixel text-[9px] text-arcade-muted">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
              {profile?.id === comment.user_id && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="font-pixel text-[9px] text-arcade-red hover:text-arcade-red/70 transition-colors"
                >
                  SIL
                </button>
              )}
            </div>
            <p className="text-sm text-arcade-text leading-relaxed">
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      {/* Input form */}
      {profile && (
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-arcade-border pt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="YORUM YAZ..."
            maxLength={280}
            className={[
              "flex-1 bg-arcade-bg border-2 border-arcade-border px-3 py-2 text-sm",
              "focus:border-arcade-yellow focus:outline-none transition-colors",
              "font-pixel text-[10px] placeholder:text-arcade-muted",
            ].join(" ")}
          />
          <PixelButton
            type="submit"
            size="sm"
            disabled={submitting || !input.trim()}
          >
            GONDER
          </PixelButton>
        </form>
      )}
    </div>
  );
}
