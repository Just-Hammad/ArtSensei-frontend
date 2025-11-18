"use server";

import { getClient } from "@/lib/Supabase/server";
import { revalidateTag } from "next/cache";

export async function addMessage(sessionId, messageData) {
  try {
    const supabase = await getClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("[Add Message] User not authenticated");
      return { success: false, error: "User not authenticated" };
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("[Add Message] Session not found:", sessionError);
      return { success: false, error: "Session not found" };
    }

    if (session.user_id !== user.id && session.user_id !== "ANONYMOUS_USER") {
      console.error("[Add Message] Unauthorized access to session");
      return { success: false, error: "Unauthorized" };
    }

    const attachmentUrls = (messageData.attachments || [])
      .map(att => {
        if (typeof att === 'string') return att;
        return att.serverUrl || att.url;
      })
      .filter(url => url && typeof url === 'string' && !url.startsWith('data:'))
      .filter(url => url.trim().length > 0); 

    console.log("[Add Message] Processed attachments:", attachmentUrls.length, "URLs");

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        chat_session_id: sessionId,
        role: messageData.role,
        content: messageData.content,
        attachments: attachmentUrls,
        example_image: messageData.exampleImage || null,
        metadata: messageData.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("[Add Message] Error inserting message:", error);
      return { success: false, error: error.message };
    }

    revalidateTag(`session-messages-${sessionId}`);

    console.log("[Add Message] Message added successfully:", data.id);
    return { success: true, message: data };
  } catch (err) {
    console.error("[Add Message] Unexpected error:", err);
    return { success: false, error: err.message };
  }
}

export async function getSessionMessages(sessionId) {
  try {
    const supabase = await getClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("[Get Session Messages] User not authenticated");
      return { data: null, error: "User not authenticated" };
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("[Get Session Messages] Session not found:", sessionError);
      return { data: null, error: "Session not found" };
    }

    if (session.user_id !== user.id && session.user_id !== "ANONYMOUS_USER") {
      console.error("[Get Session Messages] Unauthorized access to session");
      return { data: null, error: "Unauthorized" };
    }

    // Fetch messages
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[Get Session Messages] Error fetching messages:", error);
      return { data: null, error: error.message };
    }

    return { data: messages, error: null };
  } catch (err) {
    console.error("[Get Session Messages] Unexpected error:", err);
    return { data: null, error: err.message };
  }
}

export async function addMessagesBatch(sessionId, messages) {
  try {
    const supabase = await getClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("[Add Messages Batch] User not authenticated");
      return { success: false, error: "User not authenticated" };
    }

    // Verify session exists and belongs to user
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("[Add Messages Batch] Session not found:", sessionError);
      return { success: false, error: "Session not found" };
    }

    if (session.user_id !== user.id && session.user_id !== "ANONYMOUS_USER") {
      console.error("[Add Messages Batch] Unauthorized access to session");
      return { success: false, error: "Unauthorized" };
    }

    // Process messages
    const messagesToInsert = messages.map(msg => {
      const attachmentUrls = (msg.attachments || [])
        .map(att => {
          if (typeof att === 'string') {
            return att;
          }
          return att.serverUrl || att.url;
        })
        .filter(url => url && typeof url === 'string' && !url.startsWith('data:')) // Filter out data URLs
        .filter(url => url.trim().length > 0); // Filter out empty strings

      return {
        chat_session_id: sessionId,
        role: msg.role,
        content: msg.content,
        attachments: attachmentUrls,
        example_image: msg.exampleImage || null,
        metadata: msg.metadata || {},
      };
    });

    const { data, error } = await supabase
      .from("chat_messages")
      .insert(messagesToInsert)
      .select();

    if (error) {
      console.error("[Add Messages Batch] Error inserting messages:", error);
      return { success: false, error: error.message };
    }

    revalidateTag(`session-messages-${sessionId}`);

    console.log(`[Add Messages Batch] Added ${data.length} messages successfully`);
    return { success: true, messages: data };
  } catch (err) {
    console.error("[Add Messages Batch] Unexpected error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateMessageImage(messageId, imagePath) {
  try {
    const supabase = await getClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("[Update Message Image] User not authenticated");
      return { success: false, error: "User not authenticated" };
    }

    // Verify message exists and user has access
    const { data: message, error: messageError } = await supabase
      .from("chat_messages")
      .select("id, chat_session_id, role")
      .eq("id", messageId)
      .single();

    if (messageError || !message) {
      console.error("[Update Message Image] Message not found:", messageError);
      return { success: false, error: "Message not found" };
    }

    // Verify session ownership
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, user_id")
      .eq("id", message.chat_session_id)
      .single();

    if (sessionError || !session) {
      console.error("[Update Message Image] Session not found:", sessionError);
      return { success: false, error: "Session not found" };
    }

    if (session.user_id !== user.id && session.user_id !== "ANONYMOUS_USER") {
      console.error("[Update Message Image] Unauthorized access");
      return { success: false, error: "Unauthorized" };
    }

    // Only allow updating assistant messages
    if (message.role !== "assistant") {
      console.error("[Update Message Image] Can only update assistant messages");
      return { success: false, error: "Can only add images to assistant messages" };
    }

    // Update the example_image field
    const { data, error } = await supabase
      .from("chat_messages")
      .update({ example_image: imagePath })
      .eq("id", messageId)
      .select()
      .single();

    if (error) {
      console.error("[Update Message Image] Error updating message:", error);
      return { success: false, error: error.message };
    }

    console.log("[Update Message Image] Image updated successfully:", messageId, imagePath);
    return { success: true, message: data };
  } catch (err) {
    console.error("[Update Message Image] Unexpected error:", err);
    return { success: false, error: err.message };
  }
}
