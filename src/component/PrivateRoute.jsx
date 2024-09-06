import { Children, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";

const PrivateRoute = ({ element: Element, children, ...rest }) => {
  const navigate = useNavigate();
  const isAuth = useAuth();

  useEffect(() => {
    if (isAuth !== null && !isAuth) {
      navigate("/login", { replace: true });
    }
  }, [isAuth]);

  return isAuth && <Outlet />;
};
export default PrivateRoute;
