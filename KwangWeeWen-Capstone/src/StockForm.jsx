import { Button, InputNumber, Input, message } from "antd";
import React, { useState, useRef } from "react";
import { useStocks } from "./StockContext";
import { fetchCurrentPrice } from "./fetchCurrentPrice";
import "./StockForm.css";

// The following for Alpha Vantage API
// const API_KEY = "DEMO";
// const API_KEY = "8VFAS4EDIMVXMODJ";

const API_KEY = "vlfbSE5J4thppQmsmI1xppH0bXhAYSqE";

const StockForm = () => {
  const { addStock } = useStocks();

  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isSymbolValid, setIsSymbolValid] = useState(null);
  const symbolRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);

  const validateSymbol = async (symbol) => {
    if (!symbol) return false;
    try {
      const response = await fetch(
        // The following for Alpha Vantage API
        // `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
        `https://api.massive.com/v3/reference/tickers/${symbol}?apiKey=${API_KEY}`,
        // `https://api.massive.com/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`,
      );
      const data = await response.json();
      console.log("API response data:", data);
      // The following for Alpha Vantage API
      // const quote = data["Global Quote"]; // If no quote returned → invalid symbol
      // const valid = quote && quote["01. symbol"];

      const quote = data["results"];
      const valid = quote && quote["ticker"];

      setIsSymbolValid(valid ? true : false);
      return valid ? true : false;
    } catch (err) {
      console.error("API error:", err);
      setIsSymbolValid(false);
      return false;
    }
  };

  const resetAll = () => {
    setSymbol("");
    setPrice(null);
    setQuantity(null);
    setIsSymbolValid(null);
  };

  const handleAddStock = async () => {
    let hasError = false;

    if (!symbol.trim()) {
      message.error("Stock symbol is required");
      setSymbol("");
      symbolRef.current?.focus();
      hasError = true;
    }

    const validSymbol = await validateSymbol(symbol.trim());

    if (!validSymbol) {
      message.error("Invalid stock symbol");
      setSymbol("");
      symbolRef.current?.focus();
      hasError = true;
    }
    if (!price || price <= 0) {
      message.error("Purchase price must be greater than 0");
      setPrice(null);
      priceRef.current?.focus();
      hasError = true;
    }
    if (!quantity || quantity <= 0) {
      message.error("Quantity must be greater than 0");
      setQuantity(null);
      quantityRef.current?.focus();
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    
    addStock({
      symbol: symbol.trim().toUpperCase(),
      purchasePrice: price,
      quantity,
    });

    // const stockData = { symbol, price, quantity };
    // console.log("Validated stock:", stockData);

    message.success("Stock added successfully");

    resetAll();
    symbolRef.current?.focus();
    setLoading(false);
  };

  return (
    <div className="container">
      <Input
        ref={symbolRef}
        placeholder="Stock Symbol"
        style={{ width: 200 }}
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        status={isSymbolValid === false ? "error" : ""}
      />
      <InputNumber
        ref={priceRef}
        placeholder="Purchase Price"
        style={{ width: 200 }}
        value={price}
        onChange={(value) => setPrice(value)}
      />
      <InputNumber
        ref={quantityRef}
        placeholder="Quantity"
        style={{ width: 200 }}
        value={quantity}
        onChange={(value) => setQuantity(value)}
      />
      <Button type="primary" onClick={handleAddStock} loading={loading}>
        Add Stock
      </Button>
    </div>
  );
};
export default StockForm;
