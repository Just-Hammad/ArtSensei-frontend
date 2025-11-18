import ChatHistoryComponent from "@/components/chat-history/ChatHistoryComponent";
import { getChatSessions } from "@/actions/chat/get-sessions";

const ChatHistory = async () => {
  const { data: sessions, error } = await getChatSessions();

  if (error) {
    throw new Error(error);
  }

  return <ChatHistoryComponent sessions={sessions || []} />;
};

export default ChatHistory;