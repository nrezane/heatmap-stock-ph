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
    const fetchAllStocks = async () => {
      try {
        const responses = await Promise.all(apiUrls.map(url => fetch(url)));
        const jsonData = await Promise.all(responses.map(r => r.json()));

        const cleaned = jsonData
          .map((data, i) => {
            const entry = data?.stocks?.[0];
            if (!entry) return null;

            const currentPrice = Number(entry.price?.amount);
            const percentChange = Number(entry.percentChange);

            if (!Number.isFinite(currentPrice) || !Number.isFinite(percentChange)) {
              console.warn("Invalid data:", apiUrls[i], entry);
              return null;
            }

            return {
              name: entry.name,
              price: currentPrice,
              percentChange,
              asOf: data.as_of
            };
          })
          .filter(Boolean);

        setStocks(cleaned);

        if (cleaned.length > 0) setAsOf(cleaned[0].asOf);

      } catch (e) {
        console.error("Error fetching API:", e);
      }
    };

    fetchAllStocks();
  }, []);

  const formattedDate = asOf ? new Date(asOf).toLocaleString() : '';

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Stock Heatmap</h1>

      {formattedDate && (
        <p className="text-center text-gray-500 mb-6">
          Last updated: {formattedDate}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stocks.map((s, i) => {
          const startOfDay = s.price / (1 + s.percentChange / 100);

          return (
            <div
              key={i}
              className={`p-4 rounded-lg text-white text-center font-semibold shadow-lg ${
                s.percentChange >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <h2 className="text-xl">{s.name}</h2>
              <p>Price: {s.price.toFixed(2)} PHP</p>
              <p>Start of Day: {startOfDay.toFixed(2)} PHP</p>
              <p>Change: {s.percentChange.toFixed(2)}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StockGrid;
