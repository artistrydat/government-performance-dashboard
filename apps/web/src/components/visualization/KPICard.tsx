import React from 'react';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'primary',
  size = 'md',
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary text-primary-content';
      case 'secondary':
        return 'bg-secondary text-secondary-content';
      case 'success':
        return 'bg-success text-success-content';
      case 'warning':
        return 'bg-warning text-warning-content';
      case 'error':
        return 'bg-error text-error-content';
      case 'info':
        return 'bg-info text-info-content';
      default:
        return 'bg-primary text-primary-content';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    const iconClass = trend.isPositive ? '▲' : '▼';
    const trendColor = trend.isPositive ? 'text-success' : 'text-error';

    return (
      <div className={`flex items-center gap-1 ${trendColor}`}>
        <span className="text-sm font-medium">{iconClass}</span>
        <span className="text-sm">
          {Math.abs(trend.value)}%{trend.label ? ` ${trend.label}` : ''}
        </span>
      </div>
    );
  };

  return (
    <div className={`card ${getColorClasses()} ${getSizeClasses()} shadow-lg`}>
      <div className="card-body p-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium opacity-80">{title}</h3>
            <div className="mt-2">
              <div className="text-2xl font-bold">{value}</div>
              {subtitle && <div className="text-sm opacity-80 mt-1">{subtitle}</div>}
            </div>
            {trend && <div className="mt-2">{getTrendIcon()}</div>}
          </div>
          {icon && <div className="flex-shrink-0 ml-4">{icon}</div>}
        </div>
      </div>
    </div>
  );
};
