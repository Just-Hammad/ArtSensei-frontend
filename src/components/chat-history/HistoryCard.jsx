"use client";

import { Sparkles } from "lucide-react";
import React from "react";
import Image from "next/image";
import MenuButton from "./MenuButton";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store";
import { useUserStore } from "@/store/user/userStore";

const HistoryCard = ({ session }) => {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);
  const resumeSession = useChatStore((state) => state.resumeSession);

  const handleCardClick = async (e) => {
    if (e.target.closest('.menu-button')) {
      return;
    }

    try {
      const userIdToUse = userId || "ANONYMOUS_USER";
      await resumeSession(session.id, userIdToUse);
      
      router.push(`/chat?chat_id=${session.id}`);
    } catch (error) {
      console.error("[HistoryCard] Error resuming session:", error);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="relative w-full h-full">
        {session.cover_image ? (
          <>
            <Image
              src={session.cover_image}
              alt={session.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-medium truncate drop-shadow-lg">
                {session.title}
              </p>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-gray-400" />
            <p className="text-center px-3 text-gray-700 text-sm font-medium">
              {session.title}
            </p>
          </div>
        )}

        <MenuButton
          sessionId={session.id}
          userId={userId}
          currentTitle={session.title}
        />
      </div>
    </div>
  );
};

export default HistoryCard;
