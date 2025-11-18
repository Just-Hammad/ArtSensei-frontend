import { create } from "zustand";

export const useElevenLabsStore = create((set) => ({
  isConnected: false,
  isConnecting: false,
  error: null,
  conversationId: null,
  chatId: null,
  isMuted: false,
  isSpeaking: false,
  
  setConnected: (connected) => set({ isConnected: connected }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setError: (error) => set({ error }),
  setConversationId: (id) => set({ conversationId: id }),
  setChatId: (id) => set({ chatId: id }),
  setMuted: (muted) => set({ isMuted: muted }),
  setSpeaking: (speaking) => set({ isSpeaking: speaking }),
  
  reset: () => set({
    isConnected: false,
    isConnecting: false,
    error: null,
    conversationId: null,
    // chatId stays persistent - don't reset it
    isMuted: false,
    isSpeaking: false
  }),
  
  // Complete reset including chatId (for cleanup scenarios)
  resetChatId: () => set({ chatId: null }),
  
  // Full reset of all state
  resetAll: () => set({
    isConnected: false,
    isConnecting: false,
    error: null,
    conversationId: null,
    chatId: null,
    isMuted: false,
    isSpeaking: false
  })
}));
