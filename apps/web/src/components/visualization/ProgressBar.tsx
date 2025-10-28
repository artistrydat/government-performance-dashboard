import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'md':
        return 'h-4';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      case 'info':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-base-content/70">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-base-200 rounded-full ${getSizeClasses()}`}>
        <div
          className={`${getColorClasses()} ${getSizeClasses()} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};
