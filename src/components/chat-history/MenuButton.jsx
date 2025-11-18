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
    
    try {
      const userIdToUse = userId || userIdFromStore || "ANONYMOUS_USER";
      
      await resumeSession(sessionId, userIdToUse);
      setChatId(sessionId);
      
      router.push(`/text-chat?chat_id=${sessionId}`);
    } catch (error) {
      console.error("[MenuButton] Error continuing text chat:", error);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className="menu-button absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4 text-gray-700" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 gap-2">
          <div className="flex flex-col">
            <button 
              className="w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 transition-colors text-gray-700"
              onClick={handleContinueTextChat}
            >
              Continue text chat
            </button>
            <SessionRenameDialog
              sessionId={sessionId}
              userId={userId}
              currentTitle={currentTitle}
              open={isRenameDialogOpen}
              onOpenChange={setIsRenameDialogOpen}
              trigger={
                <button 
                  className="w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 transition-colors text-gray-700"
                  onClick={(e) => handleMenuItemClick(e, () => setIsRenameDialogOpen(true))}
                >
                  Rename
                </button>
              }
            />
            <SessionDeleteDialog
              sessionId={sessionId}
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              trigger={
                <button 
                  className="w-full text-left px-3 py-1 text-sm rounded-md hover:bg-gray-100 transition-colors text-gray-700"
                  onClick={(e) => handleMenuItemClick(e, () => setIsDeleteDialogOpen(true))}
                >
                  Delete
                </button>
              }
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MenuButton;
