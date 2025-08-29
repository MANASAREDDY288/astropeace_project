export const SkeletonMenu = () => (
  <div className=" p-4">
    {/* Main menu items */}
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <section key={index}>
          <div key={index} className="flex items-center space-x-3">
            {/* Menu icon placeholder */}
            <div className="h-5 w-5 bg-gray-400 rounded animate-pulse flex-shrink-0" />
            {/* Menu text placeholder */}
            <div className="h-4 bg-gray-400 rounded animate-pulse flex-1 max-w-[120px] sm:max-w-[160px]" />
            <div className="h-3 w-3 bg-gray-400 rounded animate-pulse flex-shrink-0" />
          </div>
          <div className="mt-2 pl-8 space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse flex-shrink-0" />
                <div className="h-3 bg-gray-300 rounded animate-pulse flex-1 max-w-[100px] sm:max-w-[140px]" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);
