export const SkeletonPasswordForm = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-400 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-400 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-400 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
        </div>
      </div>

      {/* Password Requirements */}
      <div className="mt-4 text-center">
        <div className="h-4 w-48 mx-auto bg-gray-400 rounded animate-pulse" />
      </div>
    </div>
  );
};
