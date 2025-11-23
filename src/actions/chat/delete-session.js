"use server";

import { revalidateTag } from "next/cache";
import { CHAT_SESSION_TABLE, SESSION_IMAGES_BUCKET } from "@/constants/models";
import { getClient } from "@/lib/Supabase/server";

export const deleteSession = async (sessionId) => {
  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  try {
    const folderPrefix = `${user.id}/${sessionId}`;

    const { data: filesList, error: listError } = await supabase.storage
      .from(SESSION_IMAGES_BUCKET)
      .list(folderPrefix);

    if (!listError && filesList && filesList.length > 0) {
      const filesToDelete = filesList.map(
        (file) => `${folderPrefix}/${file.name}`
      );

      const { error: deleteStorageError } = await supabase.storage
        .from(SESSION_IMAGES_BUCKET)
        .remove(filesToDelete);

      if (deleteStorageError) {
        console.error(
          "[Delete Session] Storage deletion error:",
          deleteStorageError
        );
      }
    }

    const { data, error } = await supabase
      .from(CHAT_SESSION_TABLE)
      .delete()
      .eq("id", sessionId);

    if (error) {
      console.error("[Delete Session] Database error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidateTag(`chat-sessions-${user.id}`);

    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error("[Delete Session] Unexpected error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
};
