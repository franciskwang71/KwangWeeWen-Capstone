import React from "react";
import "./App.css";
import StockForm from "./StockForm";
import StockList from "./StockList";
import logo from "./assets/capstone.svg";
import { StockProvider } from "./StockContext";

function App() {
  return (
    <StockProvider>
      <div>
        <img src={logo} alt="Capstone Logo" className="logo" />
        <h1>Stock Portfolio</h1>
        <div>
          <StockForm />
        </div>
        <h2>Stock List</h2>
        <div>
          <StockList />
        </div>{" "}
      </div>
    </StockProvider>
  );
}
export default App;
