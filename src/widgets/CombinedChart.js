import React, { useState, useEffect, useCallback } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, LinearScale, TimeScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import FetchData from '../Fetch/Fetch';
import Assignment from '../components/assignment'; // Adjust the path as necessary

ChartJS.register(LinearScale, TimeScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, annotationPlugin);

const CombinedChart = () => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState('1D');
  const [loading, setLoading] = useState(true);

  const handleDataFetched = useCallback((fetchedData) => {
    setData(fetchedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [timeRange]);

  const getTimeUnitAndStepSize = () => {
    switch (timeRange) {
      case '1D':
        return { unit: 'hour', stepSize: 1 };
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

  const priceData = data.map((item) => ({
    date: new Date(item.t),
    price: item.c,
  }));

  const volumeData = data.map((item) => ({
    date: new Date(item.t),
    volume: item.v,
  }));

  const currentPrice = priceData.length ? priceData[priceData.length - 1].price : 0;
  const lastDate = priceData.length ? priceData[priceData.length - 1].date : new Date();

  const lineData = {
    labels: priceData.map((d) => d.date),
    datasets: [
      {
        label: 'Price',
        type: 'line',
        data: priceData.map((d) => ({ x: d.date, y: d.price })),
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const ctx = chart.ctx;
          const { chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(75, 64, 238, 0.2)');
          gradient.addColorStop(1, 'rgba(75, 64, 238, 0)');
          return gradient;
        },
        borderColor: '#4B40EE',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        hoverRadius: 0,
      },
    ],
  };

  const barData = {
    labels: volumeData.map((d) => d.date),
    datasets: [
      {
        label: 'Volume',
        data: volumeData.map((d) => ({ x: d.date, y: d.volume })),
        type: 'bar',
        backgroundColor: '#E6E8EB',
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.8,
        barThickness: 2,
        maxBarThickness: 2,
      },
    ],
  };

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
          display: true,
        },
      },
      y: {
        beginAtZero: false,
        position: 'right',
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `Price: ${context.raw.y.toLocaleString()} USD`;
          },
        },
      },
      legend: {
        display: false,
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: lastDate,
            xMax: lastDate,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: `Current Price: ${currentPrice.toLocaleString()}`,
              enabled: true,
              position: 'start',
              backgroundColor: '#4B40EE',
              color: '#fff',
              padding: 6,
            },
          },
        },
      },
      customLines: {
        id: 'customLines',
        afterDraw: (chart) => {
          if (chart.tooltip._active && chart.tooltip._active.length) {
            const { ctx } = chart;
            const activePoint = chart.tooltip._active[0];
            const { x, y } = activePoint.element;

            ctx.save();
            // Draw vertical dashed line
            ctx.beginPath();
            ctx.moveTo(x, chart.chartArea.top);
            ctx.lineTo(x, chart.chartArea.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'grey';
            ctx.setLineDash([6, 6]);
            ctx.stroke();

            // Draw horizontal dashed line
            ctx.beginPath();
            ctx.moveTo(chart.chartArea.left, y);
            ctx.lineTo(chart.chartArea.right, y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'grey';
            ctx.setLineDash([6, 6]);
            ctx.stroke();

            // Display vertical line value
            const value = activePoint.element.$context.raw.y;
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#4B40EE';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Price: ${value.toLocaleString()}`, x + 10, chart.chartArea.top + 10);

            // Display horizontal line value
            const date = new Date(activePoint.element.$context.raw.x);
            ctx.textAlign = 'right';
            ctx.fillText(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, chart.chartArea.right - 10, y - 10);

            ctx.restore();
          }
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: true,
    },
  };

  const barOptions = {
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
          display: false,
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
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `Volume: ${context.raw.y.toLocaleString()}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className='flex flex-col overflow-hidden border-l border-r border-gray-300'>
      <FetchData timeRange={timeRange} onDataFetched={handleDataFetched} />
      <Assignment timeRange={timeRange} data={data} />
      <div className='flex justify-center mb-4'>
        <button onClick={() => setTimeRange('1D')} className='px-4 py-2 mx-1 border rounded'>1 Day</button>
        <button onClick={() => setTimeRange('3D')} className='px-4 py-2 mx-1 border rounded'>3 Day</button>
        <button onClick={() => setTimeRange('1W')} className='px-4 py-2 mx-1 border rounded'>1 Week</button>
        <button onClick={() => setTimeRange('1M')} className='px-4 py-2 mx-1 border rounded'>1 Month</button>
        <button onClick={() => setTimeRange('6M')} className='px-4 py-2 mx-1 border rounded'>6 Months</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className='w-1/2'>
          <div className='relative w-full h-[240px]'>
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className='w-full h-16'>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedChart;
