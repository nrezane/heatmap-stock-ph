import React, { useEffect, useState } from 'react';

const apiUrls = [
  'https://phisix-api3.appspot.com/stocks/LTG.json',
  'https://phisix-api3.appspot.com/stocks/AREIT.json',
  'https://phisix-api3.appspot.com/stocks/RCR.json',
  'https://phisix-api3.appspot.com/stocks/MREIT.json',
  'https://phisix-api3.appspot.com/stocks/CREIT.json',
  'https://phisix-api3.appspot.com/stocks/DDMPR.json',
  'https://phisix-api3.appspot.com/stocks/FILRT.json',
  'https://phisix-api3.appspot.com/stocks/VREIT.json',
  'https://phisix-api3.appspot.com/stocks/PREIT.json',
  'https://phisix-api3.appspot.com/stocks/TEL.json'
];

function StockGrid() {
  const [stocks, setStocks] = useState([]);
  const [asOf, setAsOf] = useState(null);

  useEffect(() => {
    const fetchAllStockData = async () => {
      try {
        const responses = await Promise.all(apiUrls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(r => r.json()));

        // Process stocks safely
        const validStocks = data
          .map((item, i) => {
            if (!item || !item.stock || !item.stock[0]) {
              console.warn("Invalid data from:", apiUrls[i], item);
              return null;
            }
            return item;
          })
          .filter(Boolean);

        setStocks(validStocks.map(item => item.stock[0]));

        if (validStocks.length > 0) {
          setAsOf(validStocks[0].as_of);
        }

      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchAllStockData();
  }, []);

  const formattedDate = asOf ? new Date(asOf).toLocaleString() : '';

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-2">Stock Heat Map</h1>

      {formattedDate && (
        <p className="text-center text-gray-500 mb-6">
          Last updated: {formattedDate}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stocks.map((stock, index) => {
          const currentPrice = stock.price.amount;
          const percentChange = stock.percent_change;
          const startOfDayPrice = currentPrice / (1 + percentChange / 100);

          return (
            <div
              key={index}
              className={`p-4 rounded-lg text-white text-center font-semibold shadow-lg 
                ${percentChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
            >
              <h2 className="text-xl">{stock.name}</h2>
              <p>Price: {currentPrice.toFixed(2)} PHP</p>
              <p>Start of Day Price: {startOfDayPrice.toFixed(2)} PHP</p>
              <p>Change: {percentChange.toFixed(2)}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StockGrid;