import { Calendar, Clock } from "lucide-react"

const SessionDescription = ({ createdAt, updatedAt, metadata }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3 px-4">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Created {formatDate(createdAt)}</span>
        <span className="text-gray-400">•</span>
        <span>{formatTime(createdAt)}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <span>Updated {formatDate(updatedAt)}</span>
        <span className="text-gray-400">•</span>
        <span>{formatTime(updatedAt)}</span>
      </div>
    </div>
  )
}

export default SessionDescription
