interface SkeletonFormProps {
  className?: string;
  fields?: number;
  showSubmit?: boolean;
}

export const SkeletonForm = ({
  className = "",
  fields = 10,
  showSubmit = true,
}: SkeletonFormProps) => {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-24 bg-gray-400 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
          </div>
        ))}
        {/* Text Area 1 */}
        <div className="col-span-1 sm:col-span-2 space-y-2">
          <div className="h-4 w-32 bg-gray-400 rounded animate-pulse" />
          <div className="h-32 w-full bg-gray-400 rounded animate-pulse" />
        </div>
        {/* Text Area 2 */}
        <div className="col-span-1 sm:col-span-2 space-y-2">
          <div className="h-4 w-32 bg-gray-400 rounded animate-pulse" />
          <div className="h-48 w-full bg-gray-400 rounded animate-pulse" />
        </div>
      </div>
      {showSubmit && (
        <div className="pt-4">
          <div className="h-10 w-full bg-gray-400 rounded animate-pulse" />
        </div>
      )}
    </div>
  );
};
