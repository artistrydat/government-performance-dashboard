import React from 'react';

export interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'bg-success border-success';
      case 'warning':
        return 'bg-warning border-warning';
      case 'error':
        return 'bg-error border-error';
      case 'info':
        return 'bg-info border-info';
      case 'neutral':
        return 'bg-base-300 border-base-300';
      default:
        return 'bg-base-300 border-base-300';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  const getLabelText = () => {
    if (label) return label;

    switch (status) {
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'info':
        return 'Info';
      case 'neutral':
        return 'Neutral';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${getStatusClasses()} ${getSizeClasses()} rounded-full border-2`}
        title={getLabelText()}
        aria-label={getLabelText()}
      />
      {showLabel && <span className="text-sm font-medium capitalize">{getLabelText()}</span>}
    </div>
  );
};
