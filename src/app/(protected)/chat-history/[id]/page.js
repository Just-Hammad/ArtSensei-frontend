import { getChatSessionById } from "@/actions/chat/get-sessions";
import ChatHistoryDetailComponent from "@/components/chat-history/ChatHistoryDetailComponent";

const HistorySessionDetailPage = async ({params}) => {
    const { id } = await params;

    const session = await getChatSessionById(id);

  return <ChatHistoryDetailComponent session={session.data} />;
}

export default HistorySessionDetailPage