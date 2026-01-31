import React from 'react';
import { Button } from 'antd';
import { Flex, InputNumber, Input } from 'antd';
import './App.css';
import logo from './assets/capstone.svg';

function App() {
  return (
    <div className="page-container"> 
      <div className="section-box"> 
        <img src={logo} alt="Capstone Logo" className="logo" />
        <h1>Finance Dashboard</h1>
      </div> 
      <div className="section-box"> 
        <Flex horizontal gap="middle">
          <Input placeholder="Stock Symbol" style={{ width: 200 }}/>
          <InputNumber placeholder="Purchase Price" style={{ width: 200 }} />
          <InputNumber placeholder="Quantity" style={{ width: 200 }}/>
          <Button type="primary">Add Stock</Button>
    </Flex>
      </div> 
      <div className="section-box"> 
        <p>Stock List</p>
        <p>No stocks added yet</p>
      </div> 
    </div>
  );
}
export default App