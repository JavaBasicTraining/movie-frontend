import { Outlet, Route, Router, Routes } from "react-router-dom";
import "./App.scss";
import { HomePage } from "./component/Home";
import { NavbarUser } from "./component/NavbarUser";
import Login from "./component/account/Login";
import PrivateRoute from "./component/PrivateRoute";
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
