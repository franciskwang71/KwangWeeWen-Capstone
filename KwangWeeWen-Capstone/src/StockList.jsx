import { useMemo } from "react";
import { usePortfolioMetrics } from "./usePortfolioMetrics";
import { useStocks } from "./StockContext";
import "./StockList.css";

const StockList = () => {
  const { stocks, deleteStock } = useStocks();
  const { stocks: enrichedStocks, totalProfitLoss } =
    usePortfolioMetrics(stocks);

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const profitArrow = (isProfit) => (isProfit ? "▲" : "▼");

  const arrowColor = (isProfit) => (isProfit ? "green" : "red");

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
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Purchase Price</th>
            <th>Current Price</th>
            <th>Profit/Loss</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {sortedStocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.symbol}</td>
              <td>{formatQuantity(stock.quantity)}</td>
              <td>${formatCurrency(stock.purchasePrice)}</td>
              <td>${formatCurrency(stock.currentPrice)}</td>
              <td
                style={{ color: arrowColor(stock.isProfit), fontWeight: 600 }}
              >
                {profitArrow(stock.isProfit)} $
                {formatCurrency(stock.profitLoss)}
              </td>

              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteStock(stock.id)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={4} style={{ fontWeight: "bold" }}>
              Portfolio Value
            </td>
            <td
              style={{
                fontWeight: "bold",
                color: arrowColor(totalProfitLoss >= 0),
              }}
            >
              {profitArrow(totalProfitLoss >= 0)} $
              {formatCurrency(totalProfitLoss)}
            </td>

            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default StockList;
