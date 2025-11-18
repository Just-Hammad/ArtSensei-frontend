"use client";

import { PERMISSION_STATES } from "@/constants/chat";
import { useChatStore } from "@/store";
import { useVoiceConversation } from "@/hooks/useVoiceConversation";
import { useElevenLabsStore } from "@/store/elevenlabs/elevenLabsStore";
import AudioWaveform from "./AudioWaveform";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import StopIcon from "@/shared/icons/StopIcon";
import PlayIcon from "@/shared/icons/PlayIcon";
import "./styles.css";

const PlayButton = () => {
  const searchParams = useSearchParams();
  const chatIdFromQuery = searchParams.get("chat_id");
  const hasAutoStarted = useRef(false);

  const toggleCamera = useChatStore((state) => state.toggleCamera);
  const isCameraActive = useChatStore((state) => state.isCameraActive);
  const permissionState = useChatStore((state) => state.permissionState);
  const toggleAudio = useChatStore((state) => state.toggleAudio);
  const isAudioActive = useChatStore((state) => state.isAudioActive);
  const audioPermissionState = useChatStore(
    (state) => state.audioPermissionState
  );
  const clearImages = useChatStore((state) => state.clearImages);
  const setAutoCapturing = useChatStore((state) => state.setAutoCapturing);

  const { startConversation, endConversation, isConnecting } =
    useVoiceConversation({textMode: false});
  const isConnected = useElevenLabsStore((state) => state.isConnected);
  const chatId = useElevenLabsStore((state) => state.chatId);

  const isLoading = permissionState === PERMISSION_STATES.REQUESTING;
  const isAudioLoading = audioPermissionState === PERMISSION_STATES.REQUESTING;
  const showGlow = !isCameraActive && !isConnected;
  const isActive = (isCameraActive && isAudioActive) || isConnected;

  useEffect(() => {
    const autoStartConversation = async () => {
      if (
        chatIdFromQuery &&
        !hasAutoStarted.current &&
        !isConnected &&
        !isConnecting
      ) {
        hasAutoStarted.current = true;

        try {
          clearImages();
          toggleCamera();

          await new Promise((resolve) => setTimeout(resolve, 200));

          if (!isAudioActive) {
            toggleAudio();
          }

          await startConversation(chatIdFromQuery);
          setAutoCapturing(true);
        } catch (error) {
          console.error(
            "[PlayButton] Error auto-starting conversation:",
            error
          );
          hasAutoStarted.current = false;
        }
      }
    };

    autoStartConversation();
  }, [chatIdFromQuery, isConnected, isConnecting, chatId]);

  const handleClick = async () => {
    if (!isCameraActive && !isConnected) {
      clearImages();
      toggleCamera();
      setTimeout(() => {
        if (!isAudioActive) {
          toggleAudio();
        }
      }, 200);

      await startConversation();
      setAutoCapturing(true);
    } else {
      setAutoCapturing(false);
      clearImages();

      if (isAudioActive) toggleAudio();
      if (isCameraActive) toggleCamera();

      await endConversation();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "150px",
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* connection audio moved into useVoiceConversation hook */}
      {isActive && (
        <AudioWaveform isActive={isAudioActive || isConnected} size={135} />
      )}

      <button
        onClick={handleClick}
        disabled={isLoading || isAudioLoading || isConnecting}
        className={`start-button ${showGlow ? "should-click" : ""} ${
          isCameraActive || isConnected ? "active" : ""
        }`}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          position: "absolute",
          opacity: isLoading || isAudioLoading || isConnecting ? 0.5 : 1,
          cursor:
            isLoading || isAudioLoading || isConnecting
              ? "not-allowed"
              : "pointer",
          ...((isCameraActive || isConnected) && {
            boxShadow:
              "inset 0.25rem 0.25rem 0.5rem rgba(163, 177, 198, 0.5), inset -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.8)",
          }),
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading || isAudioLoading || isConnecting ? (
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "2px solid #a3b1c6",
                borderTop: "2px solid transparent",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : isCameraActive || isConnected ? (
            <StopIcon />
          ) : (
            <PlayIcon />
          )}
        </div>
      </button>
    </div>
  );
};

export default PlayButton;
