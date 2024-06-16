import React from 'react';
import './App.css';
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="container-fluid">
      <Navbar/>
      <div className="container">
        <Outlet/>
      </div>
    </div>
  );
}

export default App;
