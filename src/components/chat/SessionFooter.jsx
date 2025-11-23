"use client"

import { MessageSquare, Mic } from "lucide-react"
import { useRouter } from "next/navigation"

const SessionFooter = ({ sessionId }) => {
  const router = useRouter()

  const handleTextChat = () => {
    router.push(`/text-chat?chat_id=${sessionId}`)
  }

  const handleVoiceChat = () => {
    router.push(`/chat?chat_id=${sessionId}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-3 pb-2">
      <p className="text-lg text-gray-600 text-center">Continue with</p>
      <div className="flex gap-3">
        <button
          onClick={handleTextChat}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-medium">Text Chat</span>
        </button>
        <button
          onClick={handleVoiceChat}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black hover:bg-gray-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Mic className="w-4 h-4" />
          <span className="text-xs font-medium">Voice Chat</span>
        </button>
      </div>
    </div>
  )
}

export default SessionFooter
