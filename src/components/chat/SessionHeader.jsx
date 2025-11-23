"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil } from "lucide-react"
import BackButton from "../settings/BackButton"
import { renameSession } from "@/actions/chat/rename-session"

const SessionHeader = ({ session }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(
    session.title.toLowerCase().includes("untitled")
      ? "Untitled Session"
      : session.title
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newTitle = title.trim()

    if (!newTitle || newTitle === session.title) {
      setIsEditing(false)
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("sessionId", session.id)
    formData.append("title", newTitle)

    const result = await renameSession(null, formData)

    setIsSubmitting(false)

    if (result.success) {
      setIsEditing(false)
    } else {
      setTitle(
        session.title.toLowerCase().includes("untitled")
          ? "Untitled Session"
          : session.title
      )
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    if (!isSubmitting) {
      setTitle(
        session.title.toLowerCase().includes("untitled")
          ? "Untitled Session"
          : session.title
      )
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setTitle(
        session.title.toLowerCase().includes("untitled")
          ? "Untitled Session"
          : session.title
      )
      setIsEditing(false)
    }
  }

  return (
    <header className="flex items-center gap-4 p-4 border-b border-gray-300">
      <BackButton backUrl={"/chat-history"} />
      
      {isEditing ? (
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="w-full text-xl font-medium text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
            maxLength={100}
          />
        </form>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="flex items-center gap-2 flex-1 cursor-pointer group"
        >
          <h1 className="text-xl font-medium text-gray-800">{title}</h1>
          <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </header>
  )
}

export default SessionHeader
