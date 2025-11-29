export const PERMISSION_STATES = {
    GRANTED: "granted",
    DENIED: "denied",
    REQUESTING: "requesting",
    IDLE: "idle",
}

export const ERROR_NAMES = {
    NOT_ALLOWED: "NotAllowedError",
    NOT_FOUND: "NotFoundError",
    NOT_SUPPORTED: "NotSupportedError",
};

export const PERMISSION_MESSAGES = {
    GENERIC: "Unable to access camera. Please check your settings and try again.",
    DENIED: "Camera permission denied. Please allow camera access and try again.",
    NOT_FOUND: "No camera found on this device.",
    NOT_SUPPORTED: "Camera access is not supported by this browser.",
};

export const AUDIO_PERMISSION_MESSAGES = {
    GENERIC: "Unable to access microphone. Please check your settings and try again.",
    DENIED: "Microphone permission denied. Please allow microphone access and try again.",
    NOT_FOUND: "No microphone found on this device.",
    NOT_SUPPORTED: "Microphone access is not supported by this browser.",
};

export const SUMMARY_GENERATION = {
    MESSAGE_THRESHOLD: 10,
    MIN_MESSAGES_FOR_SUMMARY: 5,
    GEMINI_MODEL: "gemini-2.5-flash-lite",
    MAX_TOKENS: 400,
    TEMPERATURE: 0.2,
};

export const SUMMARY_SYSTEM_PROMPT = `
You are an AI assistant specialized in creating concise and meaningful summaries of art-related conversations.

Your task:
1. Focus primarily on the **user’s actions, creations, and contributions** in the conversation.
2. Consider the assistant’s responses only to clarify, highlight, or provide context about the user’s work — do not summarize the assistant’s messages in detail.
3. Identify key topics, artworks discussed, techniques, or main insights relevant to the user’s work.
4. Produce a **short, coherent summary** capturing the essence of the discussion from the **user’s perspective**, limited to **3–4 lines suitable for mobile display**.
5. **Only output the summary itself** — do not include greetings, commentary, instructions, or any extra text.
6. Keep the language clear, accessible, and use art terminology where appropriate.
7. Avoid adding any information not present in the conversation.

Format your response as a **single concise paragraph** that can be saved directly without any further edits.
`;

export const SUMMARY_ERROR_MESSAGES = {
    INVALID_SESSION: "Invalid session ID provided",
    INVALID_MESSAGES: "Messages must be a non-empty array",
    INSUFFICIENT_MESSAGES: "Not enough messages to generate a summary",
    NO_NEW_MESSAGES: "Summary is already up to date",
    UNAUTHORIZED: "Unauthorized access to session",
    SESSION_NOT_FOUND: "Session not found",
    GENERATION_FAILED: "Failed to generate summary",
    UPDATE_FAILED: "Failed to update session summary",
};