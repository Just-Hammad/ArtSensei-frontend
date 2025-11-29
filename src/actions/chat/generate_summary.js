"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getClient } from "@/lib/Supabase/server";
import { revalidateTag } from "next/cache";
import {
  SUMMARY_GENERATION,
  SUMMARY_SYSTEM_PROMPT,
  SUMMARY_ERROR_MESSAGES,
} from "@/constants/chat";
import { validateSummaryMessages } from "@/utils/validators";
import { formatMessagesForSummary } from "@/utils/chatHelpers";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

async function generateSummaryText(formattedMessages) {
  try {
    const model = genAI.getGenerativeModel({
      model: SUMMARY_GENERATION.GEMINI_MODEL,
    });

    const result = await model.generateContent({
      contents: [
        { role: "model", parts: [{ text: SUMMARY_SYSTEM_PROMPT }] },
        { role: "user", parts: [{ text: formattedMessages }] },
      ],
      generationConfig: {
        maxOutputTokens: SUMMARY_GENERATION.MAX_TOKENS,
        temperature: SUMMARY_GENERATION.TEMPERATURE,
      },
    });

    const response = result.response;
    const summary = response.text();
    console.log("[SUMMARY] Generated summary:", summary);

    if (!summary || summary.trim().length === 0) {
      throw new Error("Generated summary is empty");
    }

    return { summary: summary.trim(), error: null };
  } catch (error) {
    console.error("[Generate Summary] AI generation error:", error);
    return { summary: null, error: SUMMARY_ERROR_MESSAGES.GENERATION_FAILED };
  }
}

async function updateSessionSummary(
  supabase,
  sessionId,
  summary,
  messageCount
) {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .update({
        summary: summary,
        summarized_message_count: messageCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) {
      console.error("[Update Session Summary] Database error:", error);
      return { success: false, error: SUMMARY_ERROR_MESSAGES.UPDATE_FAILED };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Update Session Summary] Unexpected error:", error);
    return { success: false, error: SUMMARY_ERROR_MESSAGES.UPDATE_FAILED };
  }
}

export async function generateSessionSummary(sessionId, messages) {
  try {
    if (!sessionId || typeof sessionId !== "string") {
      return { success: false, error: SUMMARY_ERROR_MESSAGES.INVALID_SESSION };
    }

    const validation = validateSummaryMessages(messages);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const supabase = await getClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: SUMMARY_ERROR_MESSAGES.UNAUTHORIZED };
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, user_id, summarized_message_count")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("[Generate Summary] Session not found:", sessionError);
      return {
        success: false,
        error: SUMMARY_ERROR_MESSAGES.SESSION_NOT_FOUND,
      };
    }

    if (session.user_id !== user.id) {
      return { success: false, error: SUMMARY_ERROR_MESSAGES.UNAUTHORIZED };
    }

    const currentMessageCount = messages.length;
    const summarizedCount = session.summarized_message_count || 0;
    const threshold = SUMMARY_GENERATION.MESSAGE_THRESHOLD;

    if (summarizedCount + threshold > currentMessageCount) {
      return {
        success: false,
        error: SUMMARY_ERROR_MESSAGES.NO_NEW_MESSAGES,
        needsUpdate: false,
      };
    }

    const formattedMessages = formatMessagesForSummary(messages);

    const { summary, error: generationError } = await generateSummaryText(
      formattedMessages
    );

    if (generationError || !summary) {
      return { success: false, error: generationError };
    }

    const updateResult = await updateSessionSummary(
      supabase,
      sessionId,
      summary,
      currentMessageCount
    );

    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    revalidateTag(`chat-sessions-${user.id}`);
    revalidateTag(`session-${sessionId}`);

    return {
      success: true,
      summary,
      summarizedMessageCount: currentMessageCount,
    };
  } catch (error) {
    console.error("[Generate Summary] Unexpected error:", error);
    return { success: false, error: error.message };
  }
}
