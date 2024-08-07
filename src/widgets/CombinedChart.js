import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import FetchData from "../Fetch/Fetch";
import Assignment from "../components/assignment";
import Navbar from "../components/nav";

// Custom components for chart elements
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

const CombinedChart = () => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState("1D");
  const [loading, setLoading] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [horizontalCursorY, setHorizontalCursorY] = useState(null);
  const [newInfoBox, setNewInfoBox] = useState(null);
  const [updatedPriceInfoBox, setUpdatedPriceInfoBox] = useState(null);

  const [activeIndex, setActiveIndex] = useState(1); // Default to 'Chart' component

  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(window.innerWidth - 200);
  const chartHeight = 360;

  const handleDataFetched = useCallback(
    (fetchedData) => {
      setData(fetchedData);
      setLoading(false);

      // Reverse data order to have newest data on the right
      const reversedData = fetchedData.slice().reverse();
      const latestDataPoint = fetchedData[0];

      if (latestDataPoint) {
        const latestPrice = latestDataPoint.c;

        const priceData = reversedData.map((item) => ({
          date: new Date(item.t).getTime(),
          price: item.c,
        }));

        const priceValues = priceData.map((item) => item.price);
        const minPrice =
          Math.min(...priceValues) -
          (Math.max(...priceValues) - Math.min(...priceValues)) * 1.15;
        const maxPrice =
          Math.max(...priceValues) +
          (Math.max(...priceValues) - Math.min(...priceValues)) * 0.5;

        const chartY =
          chartHeight -
          ((latestPrice - minPrice) / (maxPrice - minPrice)) * chartHeight;

        const updatedPriceX = chartWidth;
        setUpdatedPriceInfoBox({
          x: updatedPriceX,
          y: chartY,
          price: latestPrice,
        });
      }
    },
    [chartHeight, chartWidth]
  );

  useEffect(() => {
    if (chartContainerRef.current) {
      setChartWidth(chartContainerRef.current.offsetWidth);
    }
  }, [chartContainerRef.current?.offsetWidth, timeRange]);

  useEffect(() => {
    setLoading(true);
  }, [timeRange]);

  const getTimeUnitAndStepSize = () => {
    switch (timeRange) {
      case "1D":
        return { unit: "hour", stepSize: 2 };
      case "3D":
        return { unit: "hour", stepSize: 6 };
      case "1W":
        return { unit: "day", stepSize: 1 };
      case "1M":
        return { unit: "week", stepSize: 1 };
      case "6M":
        return { unit: "month", stepSize: 1 };
      default:
        return { unit: "day", stepSize: 1 };
    }
  };

  const { unit, stepSize } = getTimeUnitAndStepSize();

  const getTickFormatter = () => {
    switch (unit) {
      case "hour":
        return (tick) => new Date(tick).getHours() + "h";
      case "day":
      case "week":
      case "month":
        return (tick) => new Date(tick).toLocaleDateString();
      default:
        return (tick) => new Date(tick).toLocaleDateString();
    }
  };

  const tickFormatter = getTickFormatter();

  const reversedData = data.slice().reverse();

  const priceData = reversedData.map((item) => ({
    date: new Date(item.t).getTime(),
    price: item.c,
  }));

  const volumeData = reversedData.map((item) => ({
    date: new Date(item.t).getTime(),
    volume: item.v,
  }));

  const priceValues = priceData.map((item) => item.price);
  const minPrice =
    Math.min(...priceValues) -
    (Math.max(...priceValues) - Math.min(...priceValues)) * 1.15;
  const maxPrice =
    Math.max(...priceValues) +
    (Math.max(...priceValues) - Math.min(...priceValues)) * 0.5;

  const findClosestPoint = (data, xValue) => {
    return data.reduce((prev, curr) =>
      Math.abs(curr.date - xValue) < Math.abs(prev.date - xValue) ? curr : prev
    );
  };

  const CustomTooltip = () => null;

  const handleNavClick = (index) => {
    setActiveIndex(index);
  };

  const getButtonClass = (range) => {
    return `px-4 py-2 rounded-md ${timeRange === range ? 'bg-[#4B40EE] text-white' : ''}`;
  };

  return (
    <div className="flex flex-col gap-5 text-[#6F7177]" ref={chartContainerRef}>
      <FetchData timeRange={timeRange} onDataFetched={handleDataFetched} />
      <Assignment timeRange={timeRange} data={data} />
      <Navbar activeIndex={activeIndex} onNavClick={handleNavClick} />
      {activeIndex === 0 && <div>Summary Content</div>}
      {activeIndex === 1 && (
        <div className="flex flex-col">
          <div className="flex justify-between pt-8">
            <div className="flex justify-start items-center">
              <button className="px-4 py-2 mx-1 rounded flex gap-2 justify-center items-center">
                <img src="expand.svg" alt="" />
                Fullscreen
              </button>
              <button className="px-4 py-2 mx-1 rounded flex gap-2 justify-center items-center">
                <img src="comapre.svg" alt="" />
                Compare
              </button>
            </div>
            <div className="flex justify-center items-center gap-1">
              <button
                onClick={() => setTimeRange("1D")}
                className={getButtonClass("1D")}
              >
                1d
              </button>
              <button
                onClick={() => setTimeRange("3D")}
                className={getButtonClass("3D")}
              >
                3d
              </button>
              <button
                onClick={() => setTimeRange("1W")}
                className={getButtonClass("1W")}
              >
                1w
              </button>
              <button
                onClick={() => setTimeRange("1M")}
                className={getButtonClass("1M")}
              >
                1m
              </button>
              <button
                onClick={() => setTimeRange("6M")}
                className={getButtonClass("6M")}
              >
                6m
              </button>
              <button
                onClick={() => setTimeRange("1Y")}
                className={getButtonClass("1Y")}
              >
                1y
              </button>
              <button
                onClick={() => setTimeRange("MAX")}
                className={getButtonClass("MAX")}
              >
                max
              </button>
            </div>
          </div>
          {loading ? (
            <div className="py-6">Max Fetch reached per minute(5)! Fetching wait...</div>
          ) : (
            <div
              className="relative border-r-[1px] border-l-[1px] border-b-[1px] border-[#E2E4E7]"
              style={{ width: chartWidth, height: chartHeight }}
            >
              <ResponsiveContainer width="100%" height="100%">
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
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{ height: 40, zIndex: -1 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <XAxis
                      dataKey="date"
                      tickFormatter={tickFormatter}
                      hide={true}
                    />
                    <YAxis hide={true} />
                    <Bar dataKey="volume" fill="#E6E8EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {newInfoBox && (
                <NewInfoBox
                  x={newInfoBox.x}
                  y={newInfoBox.y}
                  info={newInfoBox.info}
                />
              )}
              {updatedPriceInfoBox && (
                <UpdatedPriceInfoBox
                  x={updatedPriceInfoBox.x}
                  y={updatedPriceInfoBox.y}
                  price={updatedPriceInfoBox.price}
                />
              )}
            </div>
          )}
        </div>
      )}
      {activeIndex === 2 && <div>Statistics Content</div>}
      {activeIndex === 3 && <div>Analysis Content</div>}
      {activeIndex === 4 && <div>Settings Content</div>}
    </div>
  );
};

export default CombinedChart;