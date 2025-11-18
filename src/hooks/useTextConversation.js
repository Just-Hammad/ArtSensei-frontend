"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useVoiceConversation } from "./useVoiceConversation";
import { useImageBillboardStore } from "@/store/imageBillboard/imageBillboardStore";
import { useMessagesStore } from "@/store/messages/messagesStore";
import { EMPTY_STRING } from "@/constants/general";

export const useTextConversation = (options = {}) => {
  const { isResumingSession = false } = options;
  const [isSending, setIsSending] = useState(false);
  const lastMessageTimeRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const pendingImagePathRef = useRef(null);
  
  const messages = useMessagesStore((state) => state.messages);
  const addUserMessage = useMessagesStore((state) => state.addUserMessage);
  const addAssistantMessage = useMessagesStore((state) => state.addAssistantMessage);
  const clearMessagesStore = useMessagesStore((state) => state.clearMessages);

  const handleMessage = useCallback((message) => {
    lastMessageTimeRef.current = Date.now();
    
    const imageToAttach = pendingImagePathRef.current;
    
    const messageResult = addAssistantMessage(
      message.message || message.text || JSON.stringify(message),
      imageToAttach
    );
    
    if (messageResult && messageResult.id) {
      lastMessageIdRef.current = messageResult.id;
    }
    
    pendingImagePathRef.current = null;
    
    setIsSending(false);
  }, [addAssistantMessage]);
  // Use the voice conversation hook with text mode enabled
  const {
    isConnected,
    isConnecting,
    error,
    startConversation,
    endConversation,
    status,
    sendUserMessage,
  } = useVoiceConversation({
    textMode: true,
    onMessage: handleMessage,
    pendingImagePathRef,
    firstMessage: isResumingSession ? EMPTY_STRING : undefined,
  });



  const sendMessage = useCallback(
    async (text, attachments = []) => {
      if (!text.trim()) return;
      if (!isConnected) {
        console.error("Cannot send message: Not connected to ElevenLabs");
        return;
      }

      try {
        setIsSending(true);
        
        addUserMessage(text, attachments);
        
        await sendUserMessage(text);
      } catch (error) {
        console.error("Failed to send message:", error);
        setIsSending(false);
      }
    },
    [isConnected, sendUserMessage, addUserMessage]
  );

  const clearMessages = useCallback(() => {
    clearMessagesStore();
  }, [clearMessagesStore]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    error,
    status,
    
    // Conversation control
    startConversation,
    endConversation,
    
    // Message handling
    messages,
    sendMessage,
    clearMessages,
    isSending,
  };
};
