"use client";
import { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import SendQuery from "./SendQuery";
import LoadingIndicator from "./LoadingIndicator";
import { useTextConversation } from "@/hooks/useTextConversation";
import { useChatStore } from "@/store";
import { useElevenLabsStore } from "@/store/elevenlabs/elevenLabsStore";

const ChatContainer = ({ fileInputRef, isResumingSession = false }) => {
  const {
    isConnected,
    isConnecting,
    messages,
    sendMessage,
    startConversation,
    endConversation,
    isSending,
  } = useTextConversation({ isResumingSession });

  const chatId = useElevenLabsStore((state) => state.chatId);
  const setActiveAttachment = useChatStore(
    (state) => state.setActiveAttachment
  );

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const hasStartedConversation = useRef(false);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState(null);
  const isInitialLoad = useRef(true);
  const previousMessageCount = useRef(0);
  const [textareaRows, setTextareaRows] = useState(1);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (messages.length === 0) return;

    if (isInitialLoad.current && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom("auto");
        isInitialLoad.current = false;
      }, 100);
    } else {
      scrollToBottom("smooth");
    }

    previousMessageCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (isSending) {
      scrollToBottom("smooth");
    }
  }, [isSending]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        if (!lastMessage.streamed) {
          setStreamingMessageIndex(messages.length - 1);
          setTimeout(() => {
            setStreamingMessageIndex(null);
          }, (lastMessage.content.length / 50) * 1000 + 500);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    const initConversation = async () => {
      if (!isConnected && !isConnecting && !hasStartedConversation.current) {
        hasStartedConversation.current = true;
        
        if (isResumingSession && chatId) {
          await startConversation(chatId);
        } else {
          await startConversation();
        }
      }
    };

    initConversation();

    return () => {
      if (isConnected && hasStartedConversation.current) {
        endConversation();
        hasStartedConversation.current = false;
      }
    };
  }, [isConnected, isConnecting, isResumingSession, chatId]);

  const handleSendMessage = (text, attachments) => {
    sendMessage(text, attachments);
  };

  const handleAttachmentClick = (attachment) => {
    const attachmentToSet = typeof attachment === 'string' 
      ? { serverUrl: attachment }
      : attachment;
    
    setActiveAttachment(attachmentToSet);
  };

  const renderMessage = (message, index) => {
    if (message.role === "user") {
      return (
        <UserMessage
          key={index}
          content={message.content}
          attachments={message.attachments}
          onAttachmentClick={handleAttachmentClick}
        />
      );
    } else if (message.role === "assistant") {
      const isStreaming = index === streamingMessageIndex;
      return (
        <AssistantMessage
          key={index}
          content={message.content}
          isStreaming={isStreaming}
          onContentUpdate={scrollToBottom}
          exampleImage={message.exampleImage}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full relative bg-gray-100">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          paddingBottom: textareaRows > 1 ? '120px' : '70px'
        }}
      >
        <div className="space-y-2">
          {messages.length === 0 && isConnected && (
            <div className="text-center py-4 text-gray-400">
              Start a conversation by typing a message below
            </div>
          )}
          {messages.map((message, index) => renderMessage(message, index))}
          {isSending && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300">
        <SendQuery
          onSendMessage={handleSendMessage}
          disabled={!isConnected || isSending}
          fileInputRef={fileInputRef}
          onRowsChange={setTextareaRows}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
