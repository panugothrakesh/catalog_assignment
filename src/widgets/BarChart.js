import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, LinearScale, TimeScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, TimeScale, BarElement, Tooltip, Legend);

const BarChart = ({ data, timeRange }) => {
  const getTimeUnitAndStepSize = () => {
    switch (timeRange) {
      case '1D':
        return { unit: 'hour', maxTicksLimit: 12 };
      case '1W':
        return { unit: 'day', maxTicksLimit: 8 };
      case '1M':
        return { unit: 'week', maxTicksLimit: 5 };
      case '6M':
        return { unit: 'month', maxTicksLimit: 7 };
      default:
        return { unit: 'day', maxTicksLimit: 8 };
    }
  };

  const { unit, maxTicksLimit } = getTimeUnitAndStepSize();

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit,
        },
        grid: {
          display: true,
        },
        ticks: {
          maxTicksLimit,
          source: 'data',
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
    barPercentage: 1.0,
    categoryPercentage: 1.0,
  };

  return (
    <div className='relative w-full h-[200px]'>
      <Bar data={data} options={barOptions} />
    </div>
  );
};

export default BarChart;
