import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../API/axiosConfig";

const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/account/info");
        setUser(response.data ?? []);
        setIsUser(true);
      } catch (error) {
        if (error.response.status === 401) {
          setIsUser(false);
        }
      }
    };

    fetchUser();
  }, [navigate]); 
  return { user, isUser };
};

export default useFetchUser;
