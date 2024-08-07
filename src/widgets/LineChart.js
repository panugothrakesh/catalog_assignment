import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, LinearScale, TimeScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, TimeScale, LineElement, PointElement, Tooltip, Legend);

const LineChart = ({ data, timeRange }) => {
  const getTimeUnitAndStepSize = () => {
    switch (timeRange) {
      case '1D':
        return { unit: 'hour', stepSize: 4 };
      case '1W':
        return { unit: 'day', stepSize: 1 };
      case '1M':
        return { unit: 'week', stepSize: 1 };
      case '6M':
        return { unit: 'month', stepSize: 1 };
      default:
        return { unit: 'day', stepSize: 1 };
    }
  };

  const { unit, stepSize } = getTimeUnitAndStepSize();

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit,
          stepSize,
        },
        grid: {
          display: true,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className='relative w-full h-[400px]'>
      <Line data={data} options={lineOptions} />
    </div>
  );
};

export default LineChart;