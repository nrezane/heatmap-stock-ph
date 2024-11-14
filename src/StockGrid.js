import React, { useEffect, useState } from 'react';

// List of stock API URLs
const apiUrls = [
  'https://phisix-api3.appspot.com/stocks/LTG.json',
  'https://phisix-api3.appspot.com/stocks/AREIT.json',
  'https://phisix-api3.appspot.com/stocks/RCR.json',
  'https://phisix-api3.appspot.com/stocks/MREIT.json',
  'https://phisix-api3.appspot.com/stocks/CREIT.json',
  'https://phisix-api3.appspot.com/stocks/DDMPR.json',
  'https://phisix-api3.appspot.com/stocks/FILRT.json',
  'https://phisix-api3.appspot.com/stocks/VREIT.json',
  'https://phisix-api3.appspot.com/stocks/PREIT.json'
];

function StockGrid() {
  const [stocks, setStocks] = useState([]);

  // Fetch all stock data
  useEffect(() => {
    const fetchAllStockData = async () => {
      try {
        const responses = await Promise.all(apiUrls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => response.json()));
        const stockData = data.map(stock => stock.stock[0]);
        setStocks(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchAllStockData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-6">Stock Heat Map</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-white text-center font-semibold shadow-lg 
              ${stock.percent_change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <h2 className="text-xl">{stock.name}</h2>
            <p>Price: {stock.price.amount.toFixed(2)} PHP</p>
            <p>Change: {stock.percent_change.toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockGrid;
