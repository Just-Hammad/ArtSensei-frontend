"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function revalidateImageCache(conversationId, userId) {
  try {
    if (!conversationId || !userId) {
      console.warn("[revalidateImageCache] Missing conversationId or userId");
      return { success: false, error: "Missing required parameters" };
    }

    const formData = new FormData();
    formData.append("conversation_id", conversationId);
    formData.append("user_id", userId);

    const response = await fetch(`${BACKEND_URL}/api/v1/images/revalidate-cache`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("[REVALIDATE IMAGE CACHE] Response Data:", data);
    
    return {
      success: true,
      images: data.images || [],
      totalImages: data.total_images || 0,
    };
  } catch (error) {
    console.error("[revalidateImageCache] Error:", error);
    return {
      success: false,
      error: error.message || "Failed to revalidate image cache",
    };
  }
}
