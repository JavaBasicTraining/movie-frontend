import axios from "axios";
import UsePrivate from "./UsePrivate";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8081",
});

const publicAPI = [
  "/api/v1/movies",
  "/api/v1/account/login",
  "/api/v1/account/register",
  "/api/v1/categories/list",
  "/api/v1/genre",
];

axiosInstance.interceptors.request.use(
  function (config) {
    const isPublicAPI = publicAPI.some((api) => config.url.startsWith(api));
    if (isPublicAPI) {
      return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    <UsePrivate />;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
