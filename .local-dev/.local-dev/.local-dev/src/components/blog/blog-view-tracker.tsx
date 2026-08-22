"use client";

import { useEffect } from "react";

export function BlogViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `blog-view:${postId}`;
    const now = Date.now();
    const lastTrackedAt = Number(window.sessionStorage.getItem(key) ?? 0);

    if (now - lastTrackedAt < 5000) return;

    window.sessionStorage.setItem(key, String(now));

    fetch("/api/blog/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
      keepalive: true
    }).catch(() => undefined);
  }, [postId]);

  return null;
}
