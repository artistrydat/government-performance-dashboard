import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  RiskIndicator,
  calculateRiskLevel,
  getRiskLevelFromProbabilityAndImpact,
} from '../../../components/visualization/RiskIndicator';

describe('RiskIndicator', () => {
  it('renders critical risk level with label', () => {
    render(<RiskIndicator level="critical" />);

    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toHaveClass('bg-red-600');
  });

  it('renders high risk level with label', () => {
    render(<RiskIndicator level="high" />);

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('High')).toHaveClass('bg-orange-500');
  });

  it('renders medium risk level with label', () => {
    render(<RiskIndicator level="medium" />);

    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toHaveClass('bg-yellow-400');
  });

  it('renders low risk level with label', () => {
    render(<RiskIndicator level="low" />);

    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Low')).toHaveClass('bg-green-400');
  });

  it('renders none risk level with label', () => {
    render(<RiskIndicator level="none" />);

    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('None')).toHaveClass('bg-gray-300');
  });

  it('renders without label when showLabel is false', () => {
    render(<RiskIndicator level="critical" showLabel={false} />);

    expect(screen.queryByText('Critical')).not.toBeInTheDocument();
    const indicator = screen.getByTitle('Risk Level: Critical');
    expect(indicator).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<RiskIndicator level="high" label="Custom Label" />);

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<RiskIndicator level="medium" size="sm" />);
    expect(screen.getByText('Medium')).toHaveClass('text-xs');

    rerender(<RiskIndicator level="medium" size="lg" />);
    expect(screen.getByText('Medium')).toHaveClass('text-base');
  });
});

describe('calculateRiskLevel', () => {
  it('returns critical for high scores', () => {
    expect(calculateRiskLevel(4, 5)).toBe('critical');
    expect(calculateRiskLevel(80, 100)).toBe('critical');
  });

  it('returns high for medium-high scores', () => {
    expect(calculateRiskLevel(3, 5)).toBe('high');
    expect(calculateRiskLevel(60, 100)).toBe('high');
  });

  it('returns medium for medium scores', () => {
    expect(calculateRiskLevel(2, 5)).toBe('medium');
    expect(calculateRiskLevel(40, 100)).toBe('medium');
  });

  it('returns low for low scores', () => {
    expect(calculateRiskLevel(1, 5)).toBe('low');
    expect(calculateRiskLevel(20, 100)).toBe('low');
  });

  it('returns none for very low scores', () => {
    expect(calculateRiskLevel(0, 5)).toBe('none');
    expect(calculateRiskLevel(10, 100)).toBe('none');
  });
});

describe('getRiskLevelFromProbabilityAndImpact', () => {
  it('returns critical for high probability and impact', () => {
    expect(getRiskLevelFromProbabilityAndImpact(90, 90)).toBe('critical');
    expect(getRiskLevelFromProbabilityAndImpact(100, 80)).toBe('critical');
  });

  it('returns high for medium-high probability and impact', () => {
    expect(getRiskLevelFromProbabilityAndImpact(70, 70)).toBe('high');
    expect(getRiskLevelFromProbabilityAndImpact(80, 60)).toBe('high');
  });

  it('returns medium for medium probability and impact', () => {
    expect(getRiskLevelFromProbabilityAndImpact(50, 50)).toBe('medium');
    expect(getRiskLevelFromProbabilityAndImpact(60, 40)).toBe('medium');
  });

  it('returns low for low probability and impact', () => {
    expect(getRiskLevelFromProbabilityAndImpact(30, 30)).toBe('low');
    expect(getRiskLevelFromProbabilityAndImpact(40, 20)).toBe('low');
  });

  it('returns none for very low probability and impact', () => {
    expect(getRiskLevelFromProbabilityAndImpact(10, 10)).toBe('none');
    expect(getRiskLevelFromProbabilityAndImpact(20, 15)).toBe('none');
  });
});
