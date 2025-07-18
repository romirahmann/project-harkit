export function LazyComponent() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />

      {/* Card Skeleton - Repeating Block */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border dark:border-gray-700 rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <div className="min-w-full border dark:border-gray-700 rounded-xl">
          <div className="grid grid-cols-5 gap-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
          {[...Array(5)].map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-5 gap-4 p-4 border-t dark:border-gray-700"
            >
              {[...Array(5)].map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="h-4 bg-gray-300 dark:bg-gray-700 rounded"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
