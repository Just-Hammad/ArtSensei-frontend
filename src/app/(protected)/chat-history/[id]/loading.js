export default function Loading() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-md animate-pulse flex-1" />
      </header>

      <div className="flex-1 flex flex-col gap-8 py-8 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto h-64 bg-gray-200 rounded-3xl animate-pulse px-4" />
        
        <div className="flex gap-2 px-4 w-full justify-center">
          <div className="w-[calc(33.333%-0.333rem)] aspect-square bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-[calc(33.333%-0.333rem)] aspect-square bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-[calc(33.333%-0.333rem)] aspect-square bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </div>
      </div>

      <footer className="p-4 border-t border-gray-300">
        <div className="w-full max-w-2xl mx-auto px-4 space-y-3">
          <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-32" />
          <div className="flex gap-3">
            <div className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex-1 h-14 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}
