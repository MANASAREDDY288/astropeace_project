export const SkeletonTable = () => (
  <div className="light:bg-gray-100 dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto w-full">
    <table className="w-full">
      <thead>
        <tr className="light:bg-gray-100 dark:bg-gray-800 border-b border-gray-400">
          {Array.from({ length: 6 }).map((_, index) => (
            <th
              key={index}
              className="px-2 sm:px-4 py-2 sm:py-3 text-right sm:text-left"
            >
              <div className="h-4 w-16 sm:w-24 max-w-[60px] sm:max-w-[100px] bg-gray-400 rounded animate-pulse truncate text-sm sm:text-base" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 12 }, (_, index) => (
          <tr key={index} className="border-b border-gray-400">
            <td className="px-2 sm:px-4 py-2 sm:py-3">
              <div className="h-4 w-24 sm:w-32 bg-gray-400 rounded animate-pulse" />
            </td>
            <td className="px-2 sm:px-4 py-2 sm:py-3">
              <div className="h-4 w-20 sm:w-28 bg-gray-400 rounded animate-pulse" />
            </td>
            <td className="px-2 sm:px-4 py-2 sm:py-3">
              <div className="h-4 w-16 sm:w-24 bg-gray-400 rounded animate-pulse" />
            </td>
            <td className="px-2 sm:px-4 py-2 sm:py-3">
              <div className="h-4 w-12 sm:w-20 bg-gray-400 rounded animate-pulse" />
            </td>
            <td className="px-2 sm:px-4 py-2 sm:py-3">
              <div className="h-4 w-16 sm:w-24 bg-gray-400 rounded animate-pulse" />
            </td>
            <td className="px-2 sm:px-4 py-2 sm:py-3 flex sm:flex-row flex-col sm:space-x-2 space-y-2 sm:space-y-0">
              <div className="h-5 w-5 bg-gray-400 rounded-full animate-pulse" />
              <div className="h-5 w-5 bg-gray-400 rounded-full animate-pulse" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
