const NoRowsComponent = () => (
  <div className="flex flex-col items-center justify-center h-full py-12 bg-white dark:bg-gray-900">
    <svg
      className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        d="M9 17v-2a4 4 0 014-4h3m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-lg font-medium text-gray-500 dark:text-gray-300">
      No data found
    </span>
  </div>
);

export default NoRowsComponent;
