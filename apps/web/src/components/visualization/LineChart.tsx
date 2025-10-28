import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
      tension?: number;
    }[];
  };
  title?: string;
  height?: number;
  responsive?: boolean;
  showGrid?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300,
  responsive = true,
  showGrid = true,
}) => {
  const options = {
    responsive,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: showGrid,
        },
      },
      x: {
        grid: {
          display: showGrid,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <Line data={data} options={options} />
    </div>
  );
};
