"use client";

import MediaContainer from "./MediaContainer";
import ChatContainer from "./ChatContainer";
import ImageBillboard from "../ImageBillboard";
import SpinnerOverlay from "@/shared/components/SpinnerOverlay";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "@/store";
import { useMessagesStore } from "@/store/messages/messagesStore";
import { useElevenLabsStore } from "@/store/elevenlabs/elevenLabsStore";
import { useUserStore } from "@/store/user/userStore";
import { deleteSession } from "@/actions/chat/delete-session";

const TextChatComponent = () => {
  const fileInputRef = useRef(null);
  const hasInitialized = useRef(false);
  const searchParams = useSearchParams();
  const chatIdFromQuery = searchParams.get("chat_id");
  const [initError, setInitError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const resetTextChatState = useChatStore((state) => state.resetTextChatState);
  const clearImages = useChatStore((state) => state.clearImages);
  const clearMessages = useMessagesStore((state) => state.clearMessages);
  const loadMessages = useMessagesStore((state) => state.loadMessages);
  const setChatId = useElevenLabsStore((state) => state.setChatId);
  const resetChatId = useElevenLabsStore((state) => state.resetChatId);
  const userId = useUserStore((state) => state.userId);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (hasInitialized.current) {
        console.log("[TextChatComponent] Already initialized, skipping...");
        return;
      }

      if (!userId) {
        console.log("[TextChatComponent] Waiting for userId to be loaded...");
        return;
      }

      hasInitialized.current = true;

      try {
        console.log("[TextChatComponent] User ID loaded, initializing chat...");

        if (chatIdFromQuery) {
          console.log("[TextChatComponent] Resuming session:", chatIdFromQuery);
          setChatId(chatIdFromQuery);
          await loadMessages(chatIdFromQuery);
        }

        setIsInitialized(true);
        setInitError(null);
      } catch (error) {
        console.error("[TextChatComponent] Error initializing chat:", error);
        setInitError("Internal server error. Please try again later.");
        setIsInitialized(true);
        hasInitialized.current = false;
      }
    };

    initializeChat();
  }, [userId, chatIdFromQuery, setChatId, loadMessages]);

  useEffect(() => {
    return () => {
      console.log("[TextChatComponent] Cleaning up on unmount...");
      const messages = useMessagesStore.getState().messages;
      const currentChatId = useElevenLabsStore.getState().chatId;

      const userMessages = messages.filter((msg) => msg.role === "user");

      // Delete session if it was created in this component and has no user messages
      if (!chatIdFromQuery && currentChatId && userMessages.length === 0) {
        console.log(
          "[TextChatComponent] Deleting new session with no user messages:",
          currentChatId
        );
        deleteSession(currentChatId).catch((error) => {
          console.error(
            "[TextChatComponent] Error deleting empty session:",
            error
          );
        });
      }

      // Complete cleanup of all chat-related state
      console.log("[TextChatComponent] Resetting all chat state...");
      hasInitialized.current = false;
      resetTextChatState(); // Clear uploaded images and attachments
      clearImages(); // Clear captured and uploaded images
      clearMessages(); // Clear all messages from store
      resetChatId(); // Clear chat session ID
      
      console.log("[TextChatComponent] Cleanup complete.");
    };
  }, [resetTextChatState, clearImages, clearMessages, resetChatId, chatIdFromQuery]);

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        <div className="h-[25%] px-2 flex-shrink-0">
          <MediaContainer onUploadClick={handleUploadClick} />
        </div>
        <div className="flex-1 overflow-hidden">
          {!userId || !isInitialized ? (
            <SpinnerOverlay />
          ) : initError ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Connection Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{initError}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ChatContainer
              fileInputRef={fileInputRef}
              isResumingSession={!!chatIdFromQuery}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TextChatComponent;
