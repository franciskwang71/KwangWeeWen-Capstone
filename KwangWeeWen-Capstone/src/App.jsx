import React from "react";
import "./App.css";
import StockForm from "./StockForm";
import StockList from "./StockList";
import logo from "./assets/capstone.svg";
import { StockProvider } from "./StockContext";

function App() {
  return (
    <StockProvider>
      <AppLayout>
        <Header />
        <Section title="New Investment">
          <StockForm />
        </Section>
        <Section title="Stock Portfolio">
          <StockList />
        </Section>
      </AppLayout>
    </StockProvider>
  );
}

export default App;

// ----------------------
// Subcomponents
// ----------------------

function AppLayout({ children }) {
  return <main className="app-container">{children}</main>;
}

function Header() {
  return (
    <header className="app-header">
      <img src={logo} alt="Capstone Logo" className="logo" />
      <h1>Investment Dashboard</h1>
    </header>
  );
}

function Section({ title, children }) {
  return (
    <section className="app-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
