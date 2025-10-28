import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
  responsive?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 300,
  responsive = true,
}) => {
  const options = {
    responsive,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <Pie data={data} options={options} />
    </div>
  );
};
