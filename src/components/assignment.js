import React, { useState, useEffect } from "react";

const Assignment = ({ timeRange, data }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [timeRange]);

  const calculatePercentageChange = () => {
    if (!data || data.length < 2) return { change: "", color: "text-gray-500" };

    const latest = data[0];
    const opening = data[data.length - 1];

    const priceChange = latest.c - opening.c;
    const percentageChange = ((priceChange / opening.c) * 100).toFixed(2);

    // Ensure priceChange is rounded to 2 decimal places
    const roundedPriceChange = priceChange.toFixed(2);

    const changeText = `${
      priceChange > 0 ? "+ " : "- "
    }${Math.abs(roundedPriceChange).toLocaleString()} (${percentageChange}%)`;
    const colorClass = priceChange > 0 ? "text-[#67BF6B]" : "text-[#EB5757]";

    return { change: changeText, color: colorClass };
  };

  const { change, color } = calculatePercentageChange();

  return (
    <div className="">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        data && (
            <div className="flex flex-col gap-4">
              <h2 className="text-6xl flex items-start gap-2">
                <span>{data[0]?.c.toLocaleString()}</span>
                <span className="text-xl mt-[.35rem] text-[#BDBEBF]">USD</span>
              </h2>
              <p className={`${color} tracking-[0.0125rem]`}>{change}</p>
            </div>
        )
      )}
    </div>
  );
};

export default Assignment;
