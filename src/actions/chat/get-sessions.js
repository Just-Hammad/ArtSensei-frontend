"use server";

import { unstable_cache } from "next/cache";
import { getClient } from "@/lib/Supabase/server";

export async function getChatSessions() {
  try {
    const supabase = await getClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, error: "User not authenticated" };
    }

    const getCachedSessions = unstable_cache(
      async (userId) => {
        const { data: sessions, error: sessionsError } = await supabase
          .from("chat_sessions")
          .select("*")
          .eq("user_id", userId)
          .eq("is_initiated", true)
          .order("updated_at", { ascending: false });

        if (sessionsError) {
          return { data: null, error: sessionsError.message };
        }

        return { data: sessions, error: null };
      },
      [`chat-sessions-${user.id}`],
      {
        tags: [`chat-sessions-${user.id}`],
        revalidate: 60,
      }
    );

    return await getCachedSessions(user.id);
  } catch (error) {
    return { data: null, error: error.message };
  }
}
