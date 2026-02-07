import { useEffect, useMemo, useState } from "react";
import { fetchCurrentPrice } from "./fetchCurrentPrice";

export const usePortfolioMetrics = (stocks) => {
  const [livePrices, setLivePrices] = useState({}); 
  // Fetch live prices 
  useEffect(() => { 
    const loadPrices = async () => { 
      const updated = {}; 
      for (const stock of stocks) { 
        const price = await fetchCurrentPrice(stock.symbol); 
        updated[stock.symbol] = price ?? stock.currentPrice ?? 0; } 
        setLivePrices(updated); 
      }; 
      if (stocks.length > 0) { 
        loadPrices(); } 
    }, [stocks]);

  const enrichedStocks = useMemo(() => {
    return stocks.map((stock) => {
      const currentPrice = livePrices[stock.symbol] ?? stock.currentPrice ?? 0;
      const profitLoss =
        (currentPrice - stock.purchasePrice) * stock.quantity;
      
      return {
        ...stock,
        currentPrice,
        profitLoss,
        isProfit: profitLoss >= 0,
        };
      });
  }, [stocks, livePrices]);
  
  const totalProfitLoss = useMemo(() => {
    return enrichedStocks.reduce((sum, s) => sum + s.profitLoss, 0);
  }, [enrichedStocks]);
  
  return {
    stocks: enrichedStocks,
    totalProfitLoss,
  };
};
