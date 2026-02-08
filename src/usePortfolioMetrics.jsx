import { useEffect, useMemo, useRef, useState } from "react";
import { fetchCurrentPrice } from "./fetchCurrentPrice";

export const usePortfolioMetrics = (stocks) => {
  const [livePrices, setLivePrices] = useState({});
  const priceCache = useRef({}); // cache to avoid re-fetching

  useEffect(() => {
    if (stocks.length === 0) {
      setLivePrices({});
      return;
    }

    let cancelled = false;

    const loadPrices = async () => {
      const symbols = stocks.map((s) => s.symbol);

      // Only fetch prices for symbols not already cached
      const missingSymbols = symbols.filter(
        (sym) => priceCache.current[sym] === undefined,
      );

      if (missingSymbols.length === 0) {
        // All prices already cached
        setLivePrices({ ...priceCache.current });
        return;
      }

      // Fetch missing prices in parallel
      const results = await Promise.all(
        missingSymbols.map(async (sym) => {
          const price = await fetchCurrentPrice(sym);
          return [sym, price ?? 0];
        }),
      );

      // Update cache
      for (const [sym, price] of results) {
        priceCache.current[sym] = price;
      }
      if (!cancelled) {
        setLivePrices({ ...priceCache.current });
      }
    };

    loadPrices();
    return () => {
      cancelled = true;
    };
  }, [stocks]);

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
