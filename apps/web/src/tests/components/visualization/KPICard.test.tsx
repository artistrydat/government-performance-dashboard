import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KPICard } from '../../../components/visualization/KPICard';

describe('KPICard', () => {
  it('renders with title and value', () => {
    render(<KPICard title="Total Revenue" value="$12,345" />);

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,345')).toBeInTheDocument();
  });

  it('renders with subtitle when provided', () => {
    render(<KPICard title="Active Users" value="1,234" subtitle="Last 30 days" />);

    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('renders positive trend indicator', () => {
    render(<KPICard title="Growth Rate" value="15%" trend={{ value: 12, isPositive: true }} />);

    expect(screen.getByText('▲')).toBeInTheDocument();
    expect(screen.getByText('12%')).toBeInTheDocument();
  });

  it('renders negative trend indicator', () => {
    render(<KPICard title="Churn Rate" value="5%" trend={{ value: 8, isPositive: false }} />);

    expect(screen.getByText('▼')).toBeInTheDocument();
    expect(screen.getByText('8%')).toBeInTheDocument();
  });

  it('renders with different colors', () => {
    const { rerender } = render(<KPICard title="Test" value="100" color="success" />);

    expect(screen.getByText('Test')).toBeInTheDocument();

    rerender(<KPICard title="Test" value="100" color="error" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<KPICard title="Small" value="100" size="sm" />);

    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<KPICard title="Large" value="100" size="lg" />);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('renders with icon when provided', () => {
    const icon = <span data-testid="test-icon">📊</span>;
    render(<KPICard title="Dashboard" value="Active" icon={icon} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('handles numeric values correctly', () => {
    render(<KPICard title="Count" value={12345} />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });
});
