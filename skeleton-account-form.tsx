import { SkeletonForm } from "./skeleton-form";

export const SkeletonAccountForm = () => {
  return (
    <div className="w-full p-4">
      <div className="space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8 mb-8">
          <div className="w-full sm:w-1/3">
            <div className="h-48 w-full bg-gray-400 rounded-lg animate-pulse" />
          </div>
          <div className="w-full sm:w-2/3 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-400 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-400 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          <SkeletonForm
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            fields={4}
          />

          <SkeletonForm
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            fields={4}
          />

          <SkeletonForm
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            fields={2}
          />
        </div>
      </div>
    </div>
  );
};
