import { Button, InputNumber, Input, message } from "antd";
import { useState, useRef } from "react";
import { useStocks } from "./StockContext";
import "./StockForm.css";

const StockForm = () => {
  const { addStock } = useStocks();
  const token = "bThqd1hEWFJBanR2cFhucUlOMVllWEVieVBJdExVZUNCYm5vSl84NGxvTT0"

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
        // The following for Stock API
        `https://api.marketdata.app/v1/stocks/quotes/${symbol}/?token=${token}`
      );
      const data = await response.json();
      console.log("API response data:", data);
      const valid = data["symbol"] 

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
