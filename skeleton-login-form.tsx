export const SkeletonLoginForm = () => {
  return (
    <div className="h-auto flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Title */}
        <div className="text-center">
          <div className="mt-4 h-6 w-48 mx-auto bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-400 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-400 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-400 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-400 rounded animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-gray-400 rounded animate-pulse" />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <div className="h-4 w-24 bg-gray-400 rounded animate-pulse" />
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-400 rounded animate-pulse" />
          <div className="h-10 bg-gray-400 rounded animate-pulse" />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <div className="h-4 w-48 mx-auto bg-gray-400 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};
