import React, { useMemo } from "react";
import { usePortfolioMetrics } from "./usePortfolioMetrics";
import "./StockList.css";
import { useStocks } from "./StockContext";

const StockList = () => {
  const { stocks, deleteStock } = useStocks();
  const { stocks: enrichedStocks, totalProfitLoss } =
    usePortfolioMetrics(stocks);
  const sortedStocks = useMemo(() => {
    return [...enrichedStocks].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [enrichedStocks]);

  if (stocks.length === 0) {
    return (
      <div className="container">
        <p style={{ fontStyle: "italic", opacity: 0.7 }}>
          No stocks added yet.
        </p>
      </div>
    );
  }
  return (
    <div className="container">
      <table className="stock-table">
        <tbody>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Purchase Price</th>
            <th>Current Price</th>
            <th>Profit/Loss</th>
          </tr>
          {sortedStocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.symbol}</td>
              <td>{stock.quantity}</td>
              <td>${stock.purchasePrice.toFixed(2)}</td>
              <td>${stock.currentPrice.toFixed(2)}</td>
              <td style={{ color: stock.isProfit ? "green" : "red" }}>
                ${stock.profitLoss.toFixed(2)}
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteStock(stock.symbol)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" style={{ fontWeight: "bold" }}>
              Total P/L
            </td>
            <td
              style={{
                fontWeight: "bold",
                color: totalProfitLoss >= 0 ? "green" : "red",
              }}
            >
              ${totalProfitLoss.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default StockList;
