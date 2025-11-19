"use client";
import { Image, Mic, Send } from "lucide-react";
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
  const internalFileInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const fileInputRef = externalFileInputRef || internalFileInputRef;
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

      // Notify parent of row changes
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
      // Check if the last message is from the user (indicating no response was received)
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

      // Initiate session on first message if not already initiated
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
          placeholder={disabled ? "Not connected..." : "Type here"}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e8ecf2] text-[#666] transition-all duration-300 hover:text-gray-700 hover:scale-95 active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(163,177,198,0.6),inset_-0.125rem_-0.125rem_0.25rem_rgba(255,255,255,0.8)] flex-shrink-0"
          style={{
            opacity:
              textAreaRef.current && textAreaRef.current.value.length > 0
                ? 0
                : 1,
            pointerEvents:
              textAreaRef.current && textAreaRef.current.value.length > 0
                ? "none"
                : "auto",
            boxShadow:
              "0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
          }}
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          disabled={disabled || !hasInputText || isUploadingAttachment}
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#e8ecf2] transition-all duration-200 hover:scale-95 active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(163,177,198,0.6),inset_-0.125rem_-0.125rem_0.25rem_rgba(255,255,255,0.8)] flex-shrink-0 ${
            disabled || !hasInputText || isUploadingAttachment
              ? "cursor-not-allowed text-gray-300"
              : "cursor-pointer text-[#666] hover:text-gray-700"
          }`}
          style={{
            boxShadow:
              disabled || !hasInputText || isUploadingAttachment
                ? "none"
                : "0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
          }}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SendQuery;
