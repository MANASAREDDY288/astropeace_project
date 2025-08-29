export function SkeletonArticle() {
  return (
    <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="relative">
          <div className="bg-gray-400 h-10 w-32 sm:w-48 md:w-64 px-3 py-2 rounded-lg animate-pulse " />
        </div>
        <div className="h-10 w-10 sm:w-12 bg-gray-400 rounded-lg animate-pulse" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-10 w-20 bg-gray-400 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
