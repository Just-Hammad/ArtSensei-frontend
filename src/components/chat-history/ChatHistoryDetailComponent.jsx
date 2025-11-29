import SessionCoverImage from "../chat/SessionCoverImage"
import SessionDescription from "../chat/SessionDescription"
import SessionFooter from "../chat/SessionFooter"
import SessionHeader from "../chat/SessionHeader"
import SessionImagesPreview from "../chat/SessionImagesPreview"
import SessionSummary from "./SessionSummary"

const ChatHistoryDetailComponent = ({ session }) => {
  const displayTitle = session.title.toLowerCase().includes("untitled")
    ? "Untitled Session"
    : session.title

  return (
    <div className="flex flex-col h-[100dvh]">
      <SessionHeader session={session} />

      <div className="flex-1 flex flex-col gap-8 py-8 overflow-y-auto">
        <SessionCoverImage 
          imageUrl={session.cover_image} 
          sessionTitle={displayTitle} 
        />
        
        <SessionImagesPreview session={session} />
        
        <SessionDescription
          createdAt={session.created_at}
          updatedAt={session.updated_at}
          metadata={session.metadata}
        />
        
        <SessionSummary session={session} />
      </div>

      <footer className="p-4 border-t border-gray-300 mt-auto">
        <SessionFooter sessionId={session.id} />
      </footer>
    </div>
  )
}

export default ChatHistoryDetailComponent