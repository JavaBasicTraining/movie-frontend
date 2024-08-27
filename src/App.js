import { Outlet, Route, Router, Routes } from "react-router-dom";
import "./App.scss";
import { HomePage } from "./component/Home";
import { NavbarUser } from "./component/NavbarUser";
import { useEffect } from "react";


function App() {

  
  return (
    
    <div className="Page">
  
        <HomePage />
        <NavbarUser />
        <Outlet />
    

    </div>
  );
}

export default App;
