import axios from "axios";
import { useEffect, useState } from "react";
import { axiosInstance } from "../API/axiosConfig";

const useAuth = () => {
  const [isAuth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth(false);
    } else {
      axiosInstance
        .get("api/authenticate")
        .then((res) => {
          setAuth(true);
        })
        .catch((err) => {
          setAuth(false);
        });
    }
  }, []);

  return isAuth;
};

export default useAuth;
