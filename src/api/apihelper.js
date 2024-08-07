import React, { useEffect, useState } from 'react';

function APIHELP() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Formats date as 'YYYY-MM-DD'
  };

  const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date;
  };

  const getDateNWeeksAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n * 7);
    return date;
  };

  const getDateNMonthsAgo = (n) => {
    const date = new Date();
    date.setMonth(date.getMonth() - n);
    return date;
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = 'ZGD8YmCox65rR3rG30gd83aw6uTg3Lv2';
      const symbol = 'X:BTCUSD';
      const interval = '30/minute';

      const toDate = formatDate(new Date());
      const fromDate = formatDate(getDateNDaysAgo(3));

      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${interval}/${fromDate}/${toDate}?apiKey=${apiKey}`;

      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' }, // More typical User-Agent
        });

        setStatus(response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
    {error && <p>Error: {error}</p>}
    {status && status !== 200 && <p>Status: {status}</p>}
    {data ? (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    ) : (
      <p>Loading...</p>
    )}
  </div>
  )
}

export default APIHELP