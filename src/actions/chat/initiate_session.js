"use server"
import { getClient } from "@/lib/Supabase/server"

export const initiateChatSession = async ( sessionId) => {

    try {
        const supabase = await getClient();
        const {data: {user}, error} = await supabase.auth.getUser();
        if (error || !user) {
           return {
            success: false,
            message: "User not authenticated"
           }
        }

        const { error: insertError } = await supabase
            .from("chat_sessions")
            .update({ is_initiated: true })
            .eq("id", sessionId)
            .eq("user_id", user.id);
        
        if (insertError) {
            return {
                success: false,
                message: insertError.message
            }
        }

        return { success: true, message: "Chat session initiated successfully" };
    }catch (err) {
        console.log(err)
    }
}