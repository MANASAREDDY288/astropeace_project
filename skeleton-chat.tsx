export const SkeletonChat = () => (
  <div className="light:bg-gray-100 dark:bg-gray-800 shadow-sm rounded-lg p-4 overflow-y-auto max-h-[400px]">
    {Array.from({ length: 10 }).map((_, index) => {
      const isRight = index % 2 === 1; // Alternate between left and right

      return (
        <div
          key={index}
          className={`flex items-center mb-4 last:mb-0 ${
            isRight ? "justify-end" : "justify-start"
          }`}
        >
          {/* Avatar Placeholder (only on left for received messages) */}
          {!isRight && (
            <div className="mr-3">
              <div className="h-10 w-10 bg-gray-400 rounded-full animate-pulse" />
            </div>
          )}
          {/* Message Card */}
          <div
            className={`flex flex-col ${isRight ? "items-end" : "items-start"}`}
          >
            <div className="h-6 w-32 sm:w-40 bg-gray-400 rounded animate-pulse" />
          </div>
          {/* Avatar Placeholder (only on right for sent messages) */}
          {isRight && (
            <div className="ml-3">
              <div className="h-10 w-10 bg-gray-400 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default SkeletonChat;
