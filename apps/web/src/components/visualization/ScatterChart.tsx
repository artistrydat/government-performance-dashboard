import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScatterController,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ScatterController);

export interface ScatterChartProps {
  data: {
    datasets: {
      label: string;
      data: { x: number; y: number }[];
      backgroundColor?: string;
      borderColor?: string;
      pointRadius?: number;
    }[];
  };
  title?: string;
  height?: number;
  responsive?: boolean;
  showGrid?: boolean;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
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
        type: 'linear' as const,
        position: 'bottom' as const,
        grid: {
          display: showGrid,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <Scatter data={data} options={options} />
    </div>
  );
};
