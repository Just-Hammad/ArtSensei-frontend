"use client";
import { Image, Mic, MicOff, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store";
import { useElevenLabsStore } from "@/store/elevenlabs/elevenLabsStore";
import { useMessagesStore } from "@/store/messages/messagesStore";

const SendQuery = ({
  onSendMessage,
  disabled = false,
  fileInputRef: externalFileInputRef,
  onRowsChange,
}) => {
  const [hasInputText, setHasInputText] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [rows, setRows] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const internalFileInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const fileInputRef = externalFileInputRef || internalFileInputRef;
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const uploadImage = useChatStore((state) => state.uploadImage);
  const pendingAttachments = useChatStore((state) => state.pendingAttachments);
  const isUploadingAttachment = useChatStore(
    (state) => state.isUploadingAttachment
  );
  const clearPendingAttachments = useChatStore(
    (state) => state.clearPendingAttachments
  );
  const currentSession = useChatStore((state) => state.currentSession);
  const markSessionAsInitiated = useChatStore(
    (state) => state.markSessionAsInitiated
  );
  const chatId = useElevenLabsStore((state) => state.chatId);
  const messages = useMessagesStore((state) => state.messages);
  const addAssistantMessage = useMessagesStore(
    (state) => state.addAssistantMessage
  );

  // Initialize Speech Recognition API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          let finalTranscript = "";

          // Build the complete transcript from all final results
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }

          // Only update if we have new content
          if (finalTranscript && finalTranscript !== transcriptRef.current) {
            transcriptRef.current = finalTranscript;
            setInputValue(finalTranscript);
            setHasInputText(true);
          }
        };

        recognition.onerror = (event) => {
          console.error("[SendQuery] Speech recognition error:", event.error);
          
          if (event.error === "not-allowed" || event.error === "permission-denied") {
            alert("Microphone access denied. Please enable microphone permissions in your browser settings.");
          } else if (event.error === "no-speech") {
            console.log("[SendQuery] No speech detected");
          } else if (event.error !== "aborted") {
            alert(`Speech recognition error: ${event.error}`);
          }
          
          setIsRecording(false);
        };

        recognition.onend = () => {
          console.log("[SendQuery] Speech recognition ended");
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        console.warn("[SendQuery] Speech Recognition API not supported in this browser");
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      const scrollHeight = textAreaRef.current.scrollHeight;
      const lineHeight = 24;
      const maxHeight = lineHeight * 3;
      const newHeight = Math.min(scrollHeight, maxHeight);
      textAreaRef.current.style.height = `${newHeight}px`;

      const calculatedRows = Math.min(Math.ceil(scrollHeight / lineHeight), 3);
      setRows(calculatedRows);

      if (onRowsChange) {
        onRowsChange(calculatedRows);
      }
    }
  }, [inputValue, onRowsChange]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      setHasInputText(true);
    } else {
      setHasInputText(false);
    }
  };

  const handleSend = async () => {
    if (
      inputValue.trim() &&
      onSendMessage &&
      !disabled &&
      !isUploadingAttachment
    ) {
      if (
        messages.length > 0 &&
        messages[messages.length - 1].role === "user"
      ) {
        console.log(
          "[SendQuery] Last message is from user, adding error message"
        );
        await addAssistantMessage("An error occurred.");
      }

      const attachmentsToSend = [...pendingAttachments];

      if (chatId && currentSession && !currentSession.is_initiated) {
        console.log("[SendQuery] Initiating session on first message:", chatId);
        markSessionAsInitiated(chatId);
      }

      onSendMessage(inputValue, attachmentsToSend);
      setInputValue("");
      setHasInputText(false);
      setRows(1);

      clearPendingAttachments();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        await uploadImage(file);
      } catch (error) {
        console.error("[SendQuery] Failed to upload image:", error);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    try {
      // Reset transcript ref when starting new recording
      transcriptRef.current = "";
      recognitionRef.current.start();
      setIsRecording(true);
      console.log("[SendQuery] Started voice recording");
    } catch (error) {
      console.error("[SendQuery] Error starting voice recording:", error);
      
      // If already started, this is fine
      if (error.message && error.message.includes("already started")) {
        setIsRecording(true);
      } else {
        alert("Failed to start voice recording. Please try again.");
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
        console.log("[SendQuery] Stopped voice recording");
      } catch (error) {
        console.error("[SendQuery] Error stopping voice recording:", error);
        setIsRecording(false);
      }
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div
      className="w-full px-2 py-3 flex items-center gap-2 bg-gray-100"
      style={{ maxWidth: "100%" }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <button
        onClick={handleImageClick}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e8ecf2] text-[#666] cursor-pointer transition-all duration-200 hover:text-gray-700 hover:scale-95 active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(163,177,198,0.6),inset_-0.125rem_-0.125rem_0.25rem_rgba(255,255,255,0.8)] flex-shrink-0"
        style={{
          boxShadow:
            "0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
        }}
      >
        <Image className="w-5 h-5" />
      </button>

      <div
        id="input-ctn"
        className="flex backdrop-blur-sm transition-all duration-300 border border-gray-300 px-4 py-2 w-full items-center gap-2"
        style={{
          borderRadius: rows > 1 ? "20px" : "9999px",
        }}
      >
        <textarea
          ref={textAreaRef}
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          rows={1}
          className="flex-1 outline-none border-none focus:outline-none resize-none overflow-hidden transition-all duration-300 bg-transparent"
          style={{
            lineHeight: "24px",
            minHeight: "24px",
          }}
          placeholder={
            disabled
              ? "Not connected..."
              : isRecording
              ? "Listening..."
              : "Type here"
          }
        />
        {!hasInputText && !isRecording && (
          <button
            onClick={handleMicClick}
            disabled={disabled}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#e8ecf2] transition-all duration-300 hover:scale-95 active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(163,177,198,0.6),inset_-0.125rem_-0.125rem_0.25rem_rgba(255,255,255,0.8)] flex-shrink-0 ${
              disabled
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer text-[#666] hover:text-gray-700"
            }`}
            style={{
              boxShadow: disabled
                ? "none"
                : "0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
            }}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}

        {isRecording && (
          <button
            onClick={handleMicClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white transition-all duration-300 hover:bg-red-600 hover:scale-95 active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(220,38,38,0.6)] flex-shrink-0 animate-pulse"
            style={{
              boxShadow:
                "0.1875rem 0.1875rem 0.375rem rgba(220, 38, 38, 0.4), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
            }}
          >
            <MicOff className="w-5 h-5" />
          </button>
        )}

        {hasInputText && !isRecording && (
          <button
            onClick={handleSend}
            disabled={disabled || isUploadingAttachment}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#e8ecf2] transition-all duration-200 hover:scale-95 active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(163,177,198,0.6),inset_-0.125rem_-0.125rem_0.25rem_rgba(255,255,255,0.8)] flex-shrink-0 ${
              disabled || isUploadingAttachment
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer text-[#666] hover:text-gray-700"
            }`}
            style={{
              boxShadow:
                disabled || isUploadingAttachment
                  ? "none"
                  : "0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SendQuery;