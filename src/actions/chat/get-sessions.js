"use server";

import { unstable_cache } from "next/cache";
import { getClient } from "@/lib/Supabase/server";
import { getUser } from "../profile/getUser";

export async function getChatSessions(userId = null) {
  try {
    if (!userId) {
      const { user, error: authError } = await getUser();

      if (authError || !user) {
        return { data: null, error: authError };
      }

      userId = user.id;
    }

    const supabase = await getClient();

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
      [`chat-sessions-${userId}`],
      {
        tags: [`chat-sessions-${userId}`],
        revalidate: 60 * 5,
      }
    );

    return await getCachedSessions(userId);
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function getChatSessionById(sessionId) {
  try {
    const { user, error: authError } = await getUser();

    if (authError || !user) {
      return { data: null, error: authError };
    }

    const supabase = await getClient();

    const cachedSessions = await getChatSessions();

    if (cachedSessions.data) {
      const session = cachedSessions.data.find((s) => s.id === sessionId);
      if (session) {
        return { data: session, error: null };
      }
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError) {
      return { data: null, error: sessionError.message };
    }

    return { data: session, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
