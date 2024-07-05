import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8081",
});

axiosInstance.interceptors.request.use(
  function (config) {
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// mỗi lần axios được gọi thì nó sẽ vào cái này check trước
    // cho nên mỗi lần vào đây set lại token, đỡ phải set tay từng api
