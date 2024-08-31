import { Outlet, Route, Router, Routes } from "react-router-dom";
import "./App.scss";
import { HomePage } from "./component/Home";
import { NavbarUser } from "./component/NavbarUser";


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
