const LoadingIndicator = () => {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 px-4">
      <span className="font-medium">Marcel</span>
      <div className="flex gap-1">
        <span
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "1s" }}
        ></span>
        <span
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "1s" }}
        ></span>
        <span
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "1s" }}
        ></span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
