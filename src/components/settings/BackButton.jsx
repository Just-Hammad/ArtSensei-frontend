"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const BackButton = ({ className = "", backUrl = null }) => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const handleBack = () => {
    setIsPressed(true);
    
    // Keep the pressed state for a brief moment before navigating
    setTimeout(() => {
      if (backUrl) {
        router.push(backUrl);
      } else {
        router.back();
      }
    }, 150); // Match this with your transition duration
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#e8ecf2] text-[#666] cursor-pointer transition-all duration-150 hover:text-gray-700 flex-shrink-0 ${className}`}
      style={{
        boxShadow: isPressed
          ? "inset 0.125rem 0.125rem 0.25rem rgba(163,177,198,0.6), inset -0.125rem -0.125rem 0.25rem rgba(255,255,255,0.8)"
          : "0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
        transform: isPressed ? "scale(0.95)" : "scale(1)",
      }}
      aria-label="Go back"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
};

export default BackButton;