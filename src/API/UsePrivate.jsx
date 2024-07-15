import { Route, Router, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../component/account/Login";

const UsePrivate = () => {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <PrivateRoute path="/login" element={<Login />} />
          {/* Các route khác */}
        </Routes>
      </Router>
    );
  };
  
  export default UsePrivate;
  