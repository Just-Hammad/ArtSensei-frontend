"use client"

import { useState } from "react"
import { Image } from "lucide-react"

const SessionCoverImage = ({ imageUrl, sessionTitle }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => setLoading(false)
  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  if (!imageUrl || error) {
    return (
      <div className="w-full max-w-2xl mx-auto aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3">
        <Image className="w-16 h-16 text-gray-400" />
        <p className="text-sm text-gray-600">No image uploaded in this session</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-center px-4">
      {loading && (
        <div className="w-full min-h-[250px] max-h-[500px] bg-gray-200 rounded-3xl flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={sessionTitle}
        onLoad={handleLoad}
        onError={handleError}
        className={`max-w-full min-w-[200px] min-h-[250px] max-h-[500px] object-contain rounded-3xl transition-opacity duration-300 ${
          loading ? "opacity-0 absolute" : "opacity-100"
        }`}
      />
    </div>
  )
}

export default SessionCoverImage
