import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BarChart } from '../../../components/visualization/BarChart';

// Mock Chart.js to avoid canvas issues in tests
vi.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: any) => (
    <div data-testid="mock-bar-chart" data-options={JSON.stringify(options)}>
      Mock Bar Chart - {data.datasets[0]?.label}: {data.datasets[0]?.data.join(', ')}
    </div>
  ),
}));

const mockData = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

describe('BarChart', () => {
  it('renders without crashing', () => {
    render(<BarChart data={mockData} />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    render(<BarChart data={mockData} title="Monthly Sales" />);
    const chart = screen.getByTestId('mock-bar-chart');
    const options = JSON.parse(chart.getAttribute('data-options') || '{}');
    expect(options.plugins.title.text).toBe('Monthly Sales');
  });

  it('applies custom height', () => {
    render(<BarChart data={mockData} height={400} />);
    const chartContainer = screen.getByTestId('mock-bar-chart').parentElement;
    expect(chartContainer).toHaveStyle('height: 400px');
  });

  it('renders with responsive design by default', () => {
    render(<BarChart data={mockData} />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      labels: [],
      datasets: [],
    };
    render(<BarChart data={emptyData} />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  it('displays correct data in mock', () => {
    render(<BarChart data={mockData} />);
    expect(screen.getByText(/Mock Bar Chart - Sales: 65, 59, 80, 81, 56/)).toBeInTheDocument();
  });
});
