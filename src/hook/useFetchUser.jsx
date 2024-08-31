import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../API/axiosConfig";

const useFetchUser = (token) => {
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("user: ", user);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token, location.pathname]);

  const fetchUser = async (onSuccess) => { /// async \\oke a
    try {
      const response = await axiosInstance.get("/api/account/info");
      // sau khi response xong nó chạy hàm này onSuccess = 
      onSuccess?.(response.data) // truyền nguyên hàm vô, thì lúc này onSuccess nó là hàm ở dưới
      // (userFetched) => {
      //   // viết vầy nó đồng code, đợi response xong nó chạy tiếp
      //   if (userFetched && userFetched.authorities.includes("admin")) {
      //     alert("Đăng Nhập Tài Khoản Admin Thành Công!!!");
      //     navigate("/admin/movie");
      //   } else {
      //     navigate("/");
      //   }
      // }
      setUser(response.data);
      setIsUser(true);
    } catch (error) {
      if (error?.response?.status === 401 && location.pathname !== "/login") {
        setIsUser(false);
        alert("Phiên bản hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  return { user, isUser, fetchUser };
};

export default useFetchUser;
