"use server";

import { revalidateTag } from "next/cache";
import { getClient } from "@/lib/Supabase/server";

export async function createChatSession(userId, customMetadata = {}) {
  try {
    const supabase = await getClient();

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        title: `UNTITLED SESSION - ${new Date().toLocaleDateString()}`,
        metadata: {
          created_via: "voice_chat",
          timestamp: new Date().toISOString(),
          ...customMetadata,
        },
      })
      .select()
      .single();

    if (error) {
      console.error("[Create Session] Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidateTag(`chat-sessions-${userId}`);

    console.log("[Create Session] Success:", data.id);
    return {
      success: true,
      sessionId: data.id,
      session: data,
    };
  } catch (err) {
    console.error("[Create Session] Unexpected error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
}
