"use client";
import { MessageSquare, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SessionFooter = ({ sessionId }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleTextChat = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Wait for the active state animation to complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Navigate after animation
    router.push(`/text-chat?chat_id=${sessionId}`);
  };

  const handleVoiceChat = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Wait for the active state animation to complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Navigate after animation
    router.push(`/chat?chat_id=${sessionId}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-4 pb-3">
      <p className="text-base text-gray-600 text-center font-medium">
        Continue with
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleTextChat}
          disabled={isNavigating}
          className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-medium">Text Chat</span>
        </button>
        <button
          onClick={handleVoiceChat}
          disabled={isNavigating}
          className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 active:from-gray-950 active:to-black text-white rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mic className="w-5 h-5" />
          <span className="text-sm font-medium">Voice Chat</span>
        </button>
      </div>
    </div>
  );
};

export default SessionFooter;