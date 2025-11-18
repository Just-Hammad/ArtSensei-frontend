import ChatHeader from "@/components/chat/header";
import TextChatComponent from "@/components/text-chat/TextChatComponent";

async function ChatPage() {
  return (
    <div className="w-full h-[100dvh] px-2 flex flex-col overflow-hidden">
      <div className="max-w-[400px] w-full flex-shrink-0">
        <ChatHeader />
      </div>

      <div className="flex-1 w-full overflow-hidden">
        <TextChatComponent />
      </div>
    </div>
  );
}

export default ChatPage;
