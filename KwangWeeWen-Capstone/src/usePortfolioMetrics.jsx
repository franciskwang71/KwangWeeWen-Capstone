import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { fetchCurrentPrice } from "./fetchCurrentPrice";

export const usePortfolioMetrics = (stocks) => {
  const [livePrices, setLivePrices] = useState({});
  const priceCache = useRef({});

  const loadPrices = useCallback(async () => {
    if (stocks.length === 0) {
      setLivePrices({});
      return;
    }

    const symbols = stocks.map((s) => s.symbol);
    const missing = symbols.filter(
      (sym) => priceCache.current[sym] === undefined
    );

    if (missing.length === 0) {
      setLivePrices({ ...priceCache.current });
      return;
    }

    const results = await Promise.all(
      missing.map(async (sym) => {
        const price = await fetchCurrentPrice(sym);
        return [sym, price ?? 0];
      })
    );

    for (const [sym, price] of results) {
      priceCache.current[sym] = price;
    }

    setLivePrices({ ...priceCache.current });
  }, [stocks]);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const enrichedStocks = useMemo(() => {
    return stocks.map((stock) => {
      const quantity = Number(stock.quantity);
      const purchasePrice = Number(stock.purchasePrice);

      const currentPrice =
        livePrices[stock.symbol] ??
        priceCache.current[stock.symbol] ??
        purchasePrice ??
        0;

      const profitLoss = (currentPrice - purchasePrice) * quantity;

      return {
        ...stock,
        quantity,
        purchasePrice,
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
