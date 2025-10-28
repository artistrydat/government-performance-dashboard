import React from 'react';

interface RealTimeStatusIndicatorProps {
  lastUpdated?: Date | null;
  isRefreshing?: boolean;
  refresh?: () => void;
  className?: string;
}

const RealTimeStatusIndicator: React.FC<RealTimeStatusIndicatorProps> = ({
  lastUpdated,
  isRefreshing = false,
  refresh,
  className = '',
}) => {
  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className="flex items-center gap-1">
        <div
          className={`w-2 h-2 rounded-full ${
            isRefreshing ? 'bg-warning animate-pulse' : 'bg-success'
          }`}
          title={isRefreshing ? 'Refreshing...' : 'Live'}
        />
        <span className="text-base-content/70">{isRefreshing ? 'Refreshing...' : 'Live'}</span>
      </div>

      {lastUpdated && (
        <span className="text-base-content/50">Updated {formatTimeAgo(lastUpdated)}</span>
      )}

      {refresh && (
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="btn btn-ghost btn-xs"
          title="Refresh data"
        >
          {isRefreshing ? <span className="loading loading-spinner loading-xs" /> : '⟳'}
        </button>
      )}
    </div>
  );
};

export default RealTimeStatusIndicator;
