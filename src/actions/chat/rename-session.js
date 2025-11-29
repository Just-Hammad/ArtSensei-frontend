"use server";

import { CHAT_SESSION_TABLE } from "@/constants/models";
import { getClient } from "@/lib/Supabase/server";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export const renameSession = async (prevState, formData) => {
    try {
        const sessionId = formData.get("sessionId");
        const updatedTitle = formData.get("title");

        if (!sessionId || !updatedTitle?.trim()) {
            return {
                success: false,
                error: "Session ID, User ID, and title are required"
            };
        }

        const supabase = await getClient();

        // get the user first
        const {data: {user}} = await supabase.auth.getUser();
        const userId = user?.id || "ANONYMOUS_USER";
        
        if (!user || !userId) {
            return {
                success: false,
                error: "User not authenticated"
            };
        }

        const { data, error } = await supabase
            .from(CHAT_SESSION_TABLE)
            .update({ title: updatedTitle.trim() })
            .eq("id", sessionId)
            .eq("user_id", userId)
            .select();

        if (error) {
            console.error("Error renaming session:", error);
            return {
                success: false,
                error: "Failed to rename session"
            };
        }


        revalidateTag(`chat-sessions-${userId}`);
        revalidatePath("/chat-history");
        
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error("Unexpected error renaming session:", error);
        return {
            success: false,
            error: "An unexpected error occurred"
        };
    }
}