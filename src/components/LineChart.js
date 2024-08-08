import React, { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const DashedCursorLine = ({ x, y, width, height, maxPrice }) => (
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

function LineChart({priceData, chartHeight, minPrice, maxPrice, chartWidth, tickFormatter, stepSize}) {
    const [newInfoBox, setNewInfoBox] = useState(null);
    const [updatedPriceInfoBox, setUpdatedPriceInfoBox] = useState(null);
    const [horizontalCursorY, setHorizontalCursorY] = useState(null);
    const [activeTooltip, setActiveTooltip] = useState(null);

    const NewInfoBox = ({ x, y, info }) => (
        <div
          className="absolute bg-[#1A243A] px-3 py-1 rounded-md z-50 -translate-y-1/2 whitespace-nowrap text-white -translate-x-3"
          style={{
            top: y,
            left: x,
          }}
        >
          <p>{info.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      );
      const UpdatedPriceInfoBox = ({ x, y, price }) => (
        <div
          className="absolute bg-[#4B40EE] px-3 py-1 rounded-md z-10 -translate-y-1/2 whitespace-nowrap text-white -translate-x-3"
          style={{
            top: y,
            left: x,
          }}
        >
          <p>{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      );


    const findClosestPoint = (data, xValue) => {
        return data.reduce((prev, curr) =>
          Math.abs(curr.date - xValue) < Math.abs(prev.date - xValue) ? curr : prev
        );
      };

    const CustomTooltip = () => null;
  return (
    <ResponsiveContainer width="100%" height="100%" style={{index: 10}}>
                <AreaChart
                  data={priceData}
                  onMouseMove={(e) => {
                    if (e.activeTooltipIndex !== undefined) {
                      const xValue = e.activeLabel;

                      const closestDataPoint = findClosestPoint(priceData, xValue);
                      const yValue = closestDataPoint.price;

                      const chartY =
                        chartHeight -
                        ((yValue - minPrice) / (maxPrice - minPrice)) * chartHeight;

                      setHorizontalCursorY(chartY);
                      setActiveTooltip({ x: e.chartX, y: chartY, width: 200 });

                      const newInfoBoxX = chartWidth;
                      const newInfoBoxY = chartY;

                      setNewInfoBox({
                        x: newInfoBoxX,
                        y: newInfoBoxY,
                        info: yValue,
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    setNewInfoBox(null);
                  }}
                >
                  <CartesianGrid
                    horizontal={false}
                    vertical={true}
                    stroke="#E2E4E7"
                    strokeWidth={1}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8E7FF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={tickFormatter}
                    interval={stepSize}
                    hide={true}
                  />
                  <YAxis domain={[minPrice, maxPrice]} hide={true} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={
                      <DashedCursorLine
                        x={activeTooltip?.x ?? 0}
                        y={horizontalCursorY ?? 0}
                        width={chartWidth}
                        height={chartHeight}
                      />
                    }
                  />
                  <Area
                    dataKey="price"
                    stroke="#4B40EE"
                    strokeWidth={2}
                    dot={false}
                    fill="url(#gradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
  )
}

export default LineChart