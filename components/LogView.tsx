"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogView({ commentId }: { commentId: string }) {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return; // reading doesn't require sign-in; only log if signed in
      supabase.from("session_logs").insert({
        user_id: data.user.id,
        comment_id: commentId,
      });
    });
  }, [commentId]);

  return null;
}