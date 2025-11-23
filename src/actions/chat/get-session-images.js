"use server";

import { getClient } from "@/lib/Supabase/server";
import { getUser } from "../profile/getUser";

export async function getSessionImages(sessionId) {
  try {
    const { user, error: authError } = await getUser();

    if (authError || !user) {
      return { data: null, error: authError };
    }

    const supabase = await getClient();

    const { data: images, error: imagesError } = await supabase
      .from("conversation_images")
      .select("id, public_url, created_at")
      .eq("chat_session_id", sessionId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (imagesError) {
      return { data: null, error: imagesError.message };
    }

    return { data: images, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
