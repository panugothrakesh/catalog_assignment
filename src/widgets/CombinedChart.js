import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import FetchData from '../Fetch/Fetch';
import Assignment from '../components/assignment'; // Adjust the path as necessary

const DashedCursorLine = ({ x, y, width, height }) => (
  <>
    <line
      x1={x}
      y1={0}
      x2={x}
      y2={height}
      stroke="grey"
      strokeDasharray="5 5"
      strokeWidth={1}
    />
    <line
      x1={0}
      y1={y}
      x2={width}
      y2={y}
      stroke="grey"
      strokeDasharray="5 5"
      strokeWidth={1}
    />
  </>
);

const PriceInfoBox = ({ x, y, price }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: x,
      backgroundColor: '#fff',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: 10,
      transform: 'translateY(-50%)', // Center the box vertically along the line
      whiteSpace: 'nowrap', // Prevent text from wrapping
    }}
  >
    <p>{price}</p>
  </div>
);

const NewInfoBox = ({ x, y, info }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: x,
      backgroundColor: '#fff',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: 10,
      transform: 'translateY(-50%)', // Center the box vertically along the line
      whiteSpace: 'nowrap', // Prevent text from wrapping
    }}
  >
    <p>{info}</p>
  </div>
);

const UpdatedPriceInfoBox = ({ x, y, price }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: x,
      backgroundColor: '#fff',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: 10,
      transform: 'translateY(-50%)', // Center the box vertically along the line
      whiteSpace: 'nowrap', // Prevent text from wrapping
    }}
  >
    <p>{price}</p>
  </div>
);

const CombinedChart = () => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState('1D');
  const [loading, setLoading] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [horizontalCursorY, setHorizontalCursorY] = useState(null);
  const [priceInfoBox, setPriceInfoBox] = useState(null);
  const [newInfoBox, setNewInfoBox] = useState(null);
  const [updatedPriceInfoBox, setUpdatedPriceInfoBox] = useState(null);
  const chartHeight = 400; // Increased height for more vertical space
  const chartWidth = (window.innerWidth - 200); // Adjusted width of the chart to leave space on the right

  const handleDataFetched = useCallback((fetchedData) => {
    setData(fetchedData);
    setLoading(false);

    // Reverse data order to have newest data on the right
    const reversedData = fetchedData.slice().reverse();
    const latestDataPoint = fetchedData[0]; // Latest data point

    if (latestDataPoint) {
      const latestPrice = latestDataPoint.c;

      // Calculate the y coordinate for the updated price info box
      const priceData = reversedData.map((item) => ({
        date: new Date(item.t).getTime(),
        price: item.c,
      }));

      const priceValues = priceData.map(item => item.price);
      const minPrice = Math.min(...priceValues) - (Math.max(...priceValues) - Math.min(...priceValues)) * 0.5; // Expanded padding at the bottom
      const maxPrice = Math.max(...priceValues) + (Math.max(...priceValues) - Math.min(...priceValues)) * 0.5; // Expanded padding at the top

      const chartY = chartHeight - ((latestPrice - minPrice) / (maxPrice - minPrice) * chartHeight);

      // Position the UpdatedPriceInfoBox at the rightmost position
      const updatedPriceX = chartWidth; // Align with the rightmost point
      setUpdatedPriceInfoBox({ x: updatedPriceX, y: chartY, price: latestPrice });
    }
  }, [chartHeight, chartWidth]);

  useEffect(() => {
    setLoading(true);
  }, [timeRange]);

  const getTimeUnitAndTickFormatter = () => {
    switch (timeRange) {
      case '1D':
        return { unit: 'hour', tickFormatter: (tick) => new Date(tick).getHours() + 'h' };
      case '1W':
        return { unit: 'day', tickFormatter: (tick) => new Date(tick).toLocaleDateString() };
      case '1M':
        return { unit: 'week', tickFormatter: (tick) => new Date(tick).toLocaleDateString() };
      case '6M':
        return { unit: 'month', tickFormatter: (tick) => new Date(tick).toLocaleDateString() };
      default:
        return { unit: 'day', tickFormatter: (tick) => new Date(tick).toLocaleDateString() };
    }
  };

  const { unit, tickFormatter } = getTimeUnitAndTickFormatter();

  // Reverse data order to have newest data on the right
  const reversedData = data.slice().reverse();

  const priceData = reversedData.map((item) => ({
    date: new Date(item.t).getTime(),
    price: item.c,
  }));

  const volumeData = reversedData.map((item) => ({
    date: new Date(item.t).getTime(),
    volume: item.v,
  }));

  // Calculate y-axis domain for line chart
  const priceValues = priceData.map(item => item.price);
  const minPrice = Math.min(...priceValues) - (Math.max(...priceValues) - Math.min(...priceValues)) * 0.5; // Expanded padding at the bottom
  const maxPrice = Math.max(...priceValues) + (Math.max(...priceValues) - Math.min(...priceValues)) * 0.5; // Expanded padding at the top

  const findClosestPoint = (data, xValue) => {
    return data.reduce((prev, curr) => (
      Math.abs(curr.date - xValue) < Math.abs(prev.date - xValue) ? curr : prev
    ));
  };

  return (
    <div className='flex flex-col overflow-hidden'>
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
        <div className='relative' style={{ width: chartWidth, height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  const xValue = e.activeLabel;

                  // Find the closest data point to the xValue
                  const closestDataPoint = findClosestPoint(priceData, xValue);

                  // Get the y value from the closest data point
                  const yValue = closestDataPoint.price;

                  // Calculate the y coordinate for the horizontal cursor line
                  const chartY = chartHeight - ((yValue - minPrice) / (maxPrice - minPrice) * chartHeight);

                  // Calculate the x coordinate for the PriceInfoBox
                  const priceInfoBoxX = chartWidth; // Position to the right of the chart
                  const priceInfoBoxY = chartY;

                  setHorizontalCursorY(chartY);
                  setActiveTooltip({ x: e.chartX, y: chartY, width: 200 });
                  setPriceInfoBox({ x: priceInfoBoxX, y: priceInfoBoxY, price: yValue });

                  // Calculate the x coordinate for the NewInfoBox (aligned with the latest data point)
                  const newInfoBoxX = chartWidth; // Position to the right of the chart
                  const newInfoBoxY = chartY;

                  setNewInfoBox({ x: newInfoBoxX, y: newInfoBoxY, info: yValue }); // Display the price at the mouse pointer
                }
              }}
              onMouseLeave={() => {
                setPriceInfoBox(null);
                setNewInfoBox(null);
              }}
            >
              <XAxis dataKey="date" tickFormatter={tickFormatter} hide={true} />
              <YAxis domain={[minPrice, maxPrice]} hide={true} />
              <Tooltip
                content={null} // Disable the default tooltip
                cursor={<DashedCursorLine x={activeTooltip?.x ?? 0} y={horizontalCursorY ?? 0} width={chartWidth} height={chartHeight} />}
              />
              <Line
                dataKey="price"
                stroke="#4B40EE"
                strokeWidth={2}
                fill="url(#gradient)"
                dot={false} // Hide the dots
                type="linear"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className='absolute bottom-0 left-0 right-0' style={{ height: 40, zIndex: -1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis dataKey="date" tickFormatter={tickFormatter} hide={true} />
                <YAxis hide={true} />
                <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                <Bar dataKey="volume" fill="#E6E8EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {priceInfoBox && <PriceInfoBox x={priceInfoBox.x} y={priceInfoBox.y} price={priceInfoBox.price} />}
          {newInfoBox && <NewInfoBox x={newInfoBox.x} y={newInfoBox.y} info={newInfoBox.info} />}
          {updatedPriceInfoBox && <UpdatedPriceInfoBox x={updatedPriceInfoBox.x} y={updatedPriceInfoBox.y} price={updatedPriceInfoBox.price} />}
        </div>
      )}
    </div>
  );
};

export default CombinedChart;