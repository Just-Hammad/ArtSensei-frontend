import { Sparkles, Loader2, MessageSquareText, Sparkle } from "lucide-react"
import { SUMMARY_GENERATION } from "@/constants/chat"

export const LoadingSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto px-2">
    <div className="bg-gray-100 rounded-lg px-2 py-2 border border-gray-200">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary animate-pulse flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-700">
              Generating Summary
            </h3>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-gray-300 rounded-full w-5/6 animate-pulse" />
            <div className="h-3 bg-gray-300 rounded-full w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const NoSummaryYet = () => (
  <div className="w-full max-w-2xl mx-auto px-2">
    <div className="bg-gray-50 rounded-lg px-2 py-2 border border-gray-200">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            No Summary Yet
          </h3>
          <p className="text-sm text-gray-500">
            Continue your conversation to generate an AI summary. At least {SUMMARY_GENERATION.MIN_MESSAGES_FOR_SUMMARY} messages are needed.
          </p>
        </div>
      </div>
    </div>
  </div>
)

export const SummaryDisplay = ({ summary, isUpdating }) => (
  <div className="w-full max-w-2xl mx-auto px-2">
    <div className="bg-gray-100 rounded-lg px-2 py-2 border border-gray-200 relative">
      {isUpdating && (
        <div className="absolute top-2 right-2">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      )}
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 pr-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Summary
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  </div>
)
