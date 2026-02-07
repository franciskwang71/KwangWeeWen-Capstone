import { createContext, useContext, useEffect, useMemo, useState } from "react";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState(() => {
    try {
      const saved = localStorage.getItem("stocks");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const addStock = (stock) => {
    const symbol = stock.symbol.trim().toUpperCase();

    setStocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(), // unique row identifier
        symbol,
        quantity: Number(stock.quantity),
        purchasePrice: Number(stock.purchasePrice),
      },
    ]);
  };

  const deleteStock = (id) => {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }, [stocks]);

  const value = useMemo(() => ({ stocks, addStock, deleteStock }), [stocks]);

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};

export const useStocks = () => useContext(StockContext);
