import React, { useState, useEffect } from 'react';

const ChartDataFetcher = ({ timeRange, onDataFetched }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => date.toISOString();

  const getDateRange = (range) => {
    const now = new Date();
    let fromDate = new Date(now);

    switch (range) {
      case '1D':
        fromDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        fromDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        fromDate.setMonth(now.getMonth() - 1);
        break;
      case '6M':
        fromDate.setMonth(now.getMonth() - 6);
        break;
      default:
        fromDate.setDate(now.getDate() - 7);
    }

    return { fromDate, toDate: now };
  };

  const fetchData = async (range) => {
    const apiKey = 'ZGD8YmCox65rR3rG30gd83aw6uTg3Lv2'; // Replace with your actual API key
    const symbol = 'X:BTCUSD';
    const { fromDate, toDate } = getDateRange(range);

    // Ensure correct date formatting for API
    const formatDateRange = (date) => date.toISOString().replace('T', ' ').split('.')[0] + 'Z';

    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/30/minute/${formatDateRange(fromDate)}/${formatDateRange(toDate)}?adjusted=true&sort=asc&apiKey=${apiKey}`;

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (!result.results) {
        throw new Error('No data found');
      }

      const priceData = result.results.map((item) => ({
        date: new Date(item.t),
        price: item.c,
      }));

      const volumeData = result.results.map((item) => ({
        date: new Date(item.t),
        volume: item.v,
      }));

      onDataFetched({ priceData, volumeData });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
    const intervalId = setInterval(() => fetchData(timeRange), 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [timeRange]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default ChartDataFetcher;
