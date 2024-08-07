import { useEffect } from 'react';

const constructUrl = (range, value) => {
  const apiKey = process.env.REACT_APP_API_KEY || 'O2To6UfjBrOHqjeqNLzSkjgTQR61fEya';
  const symbol = 'X:BTCUSD';
  let fromDate = new Date();
  const toDate = new Date();

  switch (range) {
    case '1D':
      fromDate.setDate(fromDate.getDate() - 1);
      range = 'minute';
      value = 30;
      break;
    case '3D':
      fromDate.setDate(fromDate.getDate() - 3);
      range = 'minute';
      value = 45;
      break;
    case '1W':
      fromDate.setDate(fromDate.getDate() - 7);
      range = 'hour';
      value = 5;
      break;
    case '1M':
      fromDate.setMonth(fromDate.getMonth() - 1);
      range = 'day';
      value = 1;
      break;
    case '6M':
      fromDate.setMonth(fromDate.getMonth() - 6);
      range = 'day';
      value = 7;
      break;
    case '1Y':
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      range = 'day';
      value = 15;
      break;
      case 'MAX':
        fromDate.setFullYear(fromDate.getFullYear() - 5);
        range = 'month';
        value = 1;
        break;
    default:
      fromDate.setMonth(fromDate.getMonth() - 6);
  }

  const formatDate = (date) => date.toISOString().split('T')[0];
  return `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${value}/${range}/${formatDate(fromDate)}/${formatDate(toDate)}?adjusted=true&sort=desc&apiKey=${apiKey}`;
};

const FetchData = ({ timeRange, onDataFetched }) => {
  useEffect(() => {
    const value = timeRange === '1D' ? 15 : timeRange === '3D' ? 1 : timeRange === '1W' ? 3 : timeRange === '1M' ? 12 : 1;
    const url = constructUrl(timeRange, value);

    const fetchData = () => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Data status: ${response.status}`);
          }
          return response.json();
        })
        .then(result => {
          onDataFetched(result.results); // Pass data to parent component
        })
        .catch(err => {
          console.log(err);
        });
    };

    fetchData();
  }, [timeRange, onDataFetched]);

  return null; // This component doesn't render anything
};

export default FetchData;
