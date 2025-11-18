import { create } from "zustand";
import { addMessage, getSessionMessages, updateMessageImage } from "@/actions/chat/messages";
import { useElevenLabsStore } from "@/store/elevenlabs/elevenLabsStore";

export const useMessagesStore = create((set, get) => ({
  messages: [],
  isLoading: false,

  setMessages: (messages) => {
    set({ messages });
  },

  addUserMessage: async (content, attachments = []) => {
    const chatId = useElevenLabsStore.getState().chatId;

    if (!chatId) {
      console.error(
        "[Messages Store] No active session - cannot persist message"
      );
      const message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        attachments,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, message],
      }));

      return message;
    }

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      attachments,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const attachmentsForDb = attachments
        .filter((att) => att.serverUrl)
        .map((att) => att.serverUrl);

      const result = await addMessage(chatId, {
        role: "user",
        content,
        attachments: attachmentsForDb,
      });

      if (result.success) {
        // Update with server-generated ID and data
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === optimisticMessage.id
              ? {
                  id: result.message.id,
                  role: result.message.role,
                  content: result.message.content,
                  attachments: result.message.attachments || [],
                  exampleImage: result.message.example_image,
                  timestamp: new Date(result.message.created_at).getTime(),
                }
              : msg
          ),
        }));

        console.log(
          "[Messages Store] User message persisted:",
          result.message.id
        );
        return result.message;
      } else {
        console.error(
          "[Messages Store] Failed to persist user message:",
          result.error
        );
        return optimisticMessage;
      }
    } catch (error) {
      console.error("[Messages Store] Error persisting user message:", error);
      return optimisticMessage;
    }
  },

  addAssistantMessage: async (content, exampleImage = null) => {
    const chatId = useElevenLabsStore.getState().chatId;

    if (!chatId) {
      console.error(
        "[Messages Store] No active session - cannot persist message"
      );
      const message = {
        id: `temp-${Date.now()}`,
        role: "assistant",
        content,
        exampleImage,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, message],
      }));

      return message;
    }

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      role: "assistant",
      content,
      exampleImage,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const result = await addMessage(chatId, {
        role: "assistant",
        content,
        exampleImage,
      });

      if (result.success) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === optimisticMessage.id
              ? {
                  id: result.message.id,
                  role: result.message.role,
                  content: result.message.content,
                  attachments: result.message.attachments || [],
                  exampleImage: result.message.example_image || exampleImage,
                  timestamp: new Date(result.message.created_at).getTime(),
                }
              : msg
          ),
        }));

        console.log(
          "[Messages Store] Assistant message persisted:",
          result.message.id,
          "with exampleImage:",
          result.message.example_image || exampleImage
        );
        return result.message;
      } else {
        console.error(
          "[Messages Store] Failed to persist assistant message:",
          result.error
        );
        return optimisticMessage;
      }
    } catch (error) {
      console.error(
        "[Messages Store] Error persisting assistant message:",
        error
      );
      return optimisticMessage;
    }
  },

  updateLastAssistantMessageImage: async (imagePath) => {
    const messages = get().messages;
    let updatedMessageId = null;
    let tempMessageId = null;
    
    // Update local state first (optimistic update)
    set((state) => {
      const messages = [...state.messages];

      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "assistant" && !messages[i].exampleImage) {
          updatedMessageId = messages[i].id;
          tempMessageId = messages[i].id.startsWith('temp-') ? messages[i].id : null;
          messages[i] = {
            ...messages[i],
            exampleImage: imagePath,
          };
          break;
        }
      }

      return { messages };
    });
    
    if (tempMessageId) {
      console.log("[Messages Store] Message has temp ID, waiting for persistence before updating image...");
      
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const currentMessages = get().messages;
        const persistedMessage = currentMessages.find(msg => 
          msg.exampleImage === imagePath && 
          msg.role === 'assistant' && 
          !msg.id.startsWith('temp-')
        );
        
        if (persistedMessage) {
          updatedMessageId = persistedMessage.id;
          console.log("[Messages Store] Message now persisted with ID:", updatedMessageId);
          break;
        }
      }
    }
    
    // Persist to database if we have a valid server-generated ID
    if (updatedMessageId && !updatedMessageId.startsWith('temp-')) {
      try {
        const result = await updateMessageImage(updatedMessageId, imagePath);
        
        if (result.success) {
          console.log("[Messages Store] Message image persisted to DB:", updatedMessageId, imagePath);
        } else {
          console.error("[Messages Store] Failed to persist message image:", result.error);
        }
      } catch (error) {
        console.error("[Messages Store] Error persisting message image:", error);
      }
    } else {
      console.log("[Messages Store] Message not persisted yet, image will only be in local state");
    }
  },

  // Load messages from database for a session
  loadMessages: async (sessionId) => {
    set({ isLoading: true });

    try {
      const result = await getSessionMessages(sessionId);

      if (result.data) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        
        const formattedMessages = result.data.map((msg) => {
          let attachments = [];
          
          if (msg.attachments && Array.isArray(msg.attachments)) {
            attachments = msg.attachments
              .map(att => {
                if (typeof att === 'string' && att.trim()) {
                  if (att.startsWith('http://') || att.startsWith('https://')) {
                    return att;
                  }
                  return null;
                }
                return null;
              })
              .filter(Boolean);
          }
          
          let exampleImage = null;
          if (msg.example_image) {
            exampleImage = msg.example_image;
          }

          return {
            id: msg.id,
            role: msg.role,
            content: msg.content,
            attachments: attachments,
            exampleImage: exampleImage,
            timestamp: new Date(msg.created_at).getTime(),
          };
        });

        set({
          messages: formattedMessages,
          isLoading: false,
        });

        console.log(
          `[Messages Store] Loaded ${formattedMessages.length} messages for session ${sessionId}`
        );

        // Find the last user message with an attachment
        const lastUserImageUrl = get().getLastUserImage();
        
        if (lastUserImageUrl) {
          console.log("[Messages Store] Found last user image:", lastUserImageUrl);
          // Import chatStore dynamically to avoid circular dependency
          const { useChatStore } = await import('@/store');
          useChatStore.getState().setUploadedImageFromResume(lastUserImageUrl);
        }
      } else {
        console.error(
          "[Messages Store] Failed to load messages:",
          result.error
        );
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("[Messages Store] Error loading messages:", error);
      set({ isLoading: false });
    }
  },

  // Get the last user message's image attachment
  getLastUserImage: () => {
    const messages = get().messages;
    
    // Iterate backwards to find the last user message with attachments
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === 'user' && msg.attachments && msg.attachments.length > 0) {
        // Return the first attachment URL (assuming it's an image)
        return msg.attachments[0];
      }
    }
    
    return null;
  },

  // Clear all messages
  clearMessages: () => {
    set({ messages: [] });
  },

  // Get messages (for compatibility)
  getMessages: () => {
    return get().messages;
  },
}));
