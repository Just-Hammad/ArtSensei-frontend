import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useImageBillboardStore } from "@/store/imageBillboard/imageBillboardStore";

const AssistantMessage = ({
  content,
  isStreaming = false,
  onContentUpdate,
  exampleImage,
}) => {
  const { setImagePath, setIsOpen } = useImageBillboardStore();
  const [displayedContent, setDisplayedContent] = useState("");
  const [opacity, setOpacity] = useState(0);
  const animationRef = useRef(null);
  const currentIndexRef = useRef(0);
  const containerRef = useRef(null);
  const previousContentRef = useRef("");

  const isErrorMessage = content.toLowerCase().includes("error occurred");

  useEffect(() => {
    if (exampleImage) {
      console.log("🖼️ AssistantMessage received exampleImage:", exampleImage);
    }
  }, [exampleImage]);

  useEffect(() => {
    // If not streaming, show content immediately
    if (!isStreaming) {
      setDisplayedContent(content);
      setOpacity(1);
      previousContentRef.current = content;
      currentIndexRef.current = content.length;
      return;
    }

    // Only reset if this is a completely new message (content changed from what we were animating)
    const isNewMessage =
      previousContentRef.current !== content &&
      currentIndexRef.current >= previousContentRef.current.length;

    if (isNewMessage) {
      currentIndexRef.current = 0;
      setDisplayedContent("");
      setOpacity(0);
      previousContentRef.current = content;
    }

    const startTime = Date.now();
    const charsPerSecond = 100;
    const startIndex = currentIndexRef.current;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const targetIndex = Math.min(
        startIndex + Math.floor((elapsed / 1000) * charsPerSecond),
        content.length
      );

      if (currentIndexRef.current < targetIndex) {
        currentIndexRef.current = targetIndex;
        setDisplayedContent(content.slice(0, targetIndex));

        // Notify parent for auto-scroll
        if (onContentUpdate) {
          onContentUpdate();
        }
      }

      // Set opacity to 1 immediately
      setOpacity(1);

      if (currentIndexRef.current < content.length) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [content, isStreaming, onContentUpdate]);

  const handleImageClick = () => {
    if (exampleImage) {
      setImagePath(`/${exampleImage}`);
      setIsOpen(true);
    }
  };

  return (
    <div className="flex justify-start mb-4 px-2">
      <div className="max-w-[85%] sm:max-w-[75%]">
        {exampleImage && (
          <div className="flex justify-center rounded-lg overflow-hidden w-full mb-2">
            <div
              onClick={handleImageClick}
              className="w-[60%] sm:w-[65%] md:w-[70%] rounded-lg overflow-hidden cursor-pointer transition-all hover:opacity-90"
            >
              <img
                src={`/${exampleImage}`}
                alt="Example artwork"
                className="w-full h-auto object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.style.display = "none";
                }}
              />
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className={`${
            isErrorMessage
              ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-700"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          } px-4 py-3 rounded-2xl break-words`}
          style={{
            opacity: opacity,
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {displayedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantMessage;
