import { createContext, useContext, useState, useEffect } from "react";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem("stocks");
    return saved ? JSON.parse(saved) : [];
  });

  const addStock = (stock) => {
    setStocks((prev) => [...prev, stock]);
  };

  const deleteStock = (symbol) => {
    setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
  };

  // Persist to localStorage whenever stocks change
  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }, [stocks]);

  return (
    <StockContext.Provider value={{ stocks, addStock, deleteStock}}>
      {children}
    </StockContext.Provider>
  );
};

export const useStocks = () => useContext(StockContext);
