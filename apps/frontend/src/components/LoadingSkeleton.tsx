import type { ReactElement } from 'react';

export function CustomerCardSkeleton(): ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 animate-pulse">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-300 rounded w-24"></div>
            ))}
          </div>
        </div>

        {/* Buyer Signal */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
          <div className="h-16 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

export function CommunityCardSkeleton(): ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 animate-pulse">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-10 bg-gray-300 rounded w-2/3"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          <div className="h-20 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Customer Engagement */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-2/5"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Quotes */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GeneratingMessage({
  message,
}: {
  message: string;
}): ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">{message}</h2>
          <p className="text-gray-600">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );
}
