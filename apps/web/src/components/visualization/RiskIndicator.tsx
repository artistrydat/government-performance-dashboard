import React from 'react';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

export interface RiskIndicatorProps {
  level: RiskLevel;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  label,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const getRiskClasses = () => {
    switch (level) {
      case 'critical':
        return 'bg-red-600 border-red-700 text-white';
      case 'high':
        return 'bg-orange-500 border-orange-600 text-white';
      case 'medium':
        return 'bg-yellow-400 border-yellow-500 text-gray-900';
      case 'low':
        return 'bg-green-400 border-green-500 text-gray-900';
      case 'none':
        return 'bg-gray-300 border-gray-400 text-gray-700';
      default:
        return 'bg-gray-300 border-gray-400 text-gray-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getLabelText = () => {
    if (label) return label;

    switch (level) {
      case 'critical':
        return 'Critical';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      case 'none':
        return 'None';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {showLabel ? (
        <span
          className={`${getRiskClasses()} ${getSizeClasses()} rounded-full border font-medium capitalize`}
          title={`Risk Level: ${getLabelText()}`}
          aria-label={`Risk Level: ${getLabelText()}`}
        >
          {getLabelText()}
        </span>
      ) : (
        <div
          className={`${getRiskClasses()} ${getSizeClasses()} rounded-full border`}
          title={`Risk Level: ${getLabelText()}`}
          aria-label={`Risk Level: ${getLabelText()}`}
        />
      )}
    </div>
  );
};

// Helper function to calculate risk level from score
export const calculateRiskLevel = (score: number, maxScore: number = 5): RiskLevel => {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return 'critical';
  if (percentage >= 60) return 'high';
  if (percentage >= 40) return 'medium';
  if (percentage >= 20) return 'low';
  return 'none';
};

// Helper function to get risk level from probability and impact
export const getRiskLevelFromProbabilityAndImpact = (
  probability: number, // 0-100
  impact: number // 0-100
): RiskLevel => {
  const riskScore = (probability * impact) / 100;

  if (riskScore >= 64) return 'critical'; // 80% of 80
  if (riskScore >= 36) return 'high'; // 60% of 60
  if (riskScore >= 16) return 'medium'; // 40% of 40
  if (riskScore >= 4) return 'low'; // 20% of 20
  return 'none';
};
