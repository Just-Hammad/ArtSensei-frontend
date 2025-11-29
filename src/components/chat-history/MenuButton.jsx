"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SessionDeleteDialog from "./SessionDeleteDialog";
import SessionRenameDialog from "./SessionRenameDialog";
import { useChatStore } from "@/store";
import { useUserStore } from "@/store/user/userStore";
import { useElevenLabsStore } from "@/store/elevenlabs/elevenLabsStore";

const MenuButton = ({ sessionId, userId, currentTitle }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const userIdFromStore = useUserStore((state) => state.userId);
  const resumeSession = useChatStore((state) => state.resumeSession);
  const setChatId = useElevenLabsStore((state) => state.setChatId);

  const handleMenuItemClick = (e, action) => {
    e.stopPropagation();
    if (action) action();
  };

  const handleContinueTextChat = async (e) => {
    e.stopPropagation();

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 150));
    setIsOpen(false);

    // Small delay before navigation
    setTimeout(async () => {
      try {
        const userIdToUse = userId || userIdFromStore || "ANONYMOUS_USER";

        await resumeSession(sessionId, userIdToUse);
        setChatId(sessionId);

        router.push(`/text-chat?chat_id=${sessionId}`);
      } catch (error) {
        console.error("[MenuButton] Error continuing text chat:", error);
      }
    }, 100);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();

    // Wait for animation to complete
    setTimeout(() => {
      setIsOpen(false);

      // Small delay before navigation
      setTimeout(() => {
        router.push(`/chat-history/${sessionId}`);
      }, 100);
    }, 150);
  };

  const handleRenameClick = (e) => {
    e.stopPropagation();

    // Wait for animation to complete
    setTimeout(() => {
      setIsOpen(false);

      // Small delay before opening dialog
      setTimeout(() => {
        setIsRenameDialogOpen(true);
      }, 100);
    }, 150);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();

    // Wait for animation to complete
    setTimeout(() => {
      setIsOpen(false);

      // Small delay before opening dialog
      setTimeout(() => {
        setIsDeleteDialogOpen(true);
      }, 100);
    }, 150);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="menu-button absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white active:scale-95 transition-all duration-200 shadow-sm z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4 text-gray-700" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1.5">
          <div className="flex flex-col gap-0.5">
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] transition-all duration-150 text-gray-700"
              onClick={handleViewDetails}
            >
              View details
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] transition-all duration-150 text-gray-700"
              onClick={handleContinueTextChat}
            >
              Continue text chat
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] transition-all duration-150 text-gray-700"
              onClick={handleRenameClick}
            >
              Rename
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] transition-all duration-150 text-gray-700"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <SessionRenameDialog
        sessionId={sessionId}
        userId={userId}
        currentTitle={currentTitle}
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />

      <SessionDeleteDialog
        sessionId={sessionId}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
};

export default MenuButton;
