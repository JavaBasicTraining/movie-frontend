import { notification } from 'antd';
import axios from 'axios';
import { ACCESS_TOKEN, PREVIOUS_PATH } from '../constants/storage';
import { keycloakService } from '../services/keycloakService';
import { storageService } from '../services/storageService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.120:8081';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const publicAPI = [
  '/api/v1/movies',
  '/api/v1/account/login',
  '/api/v1/account/register',
  '/api/v1/categories/list',
  '/api/v1/genre',
  '/api/v1/evaluations/numberOfReviews',
  '/api/v1/evaluations/average/',
  '/api/v1/episode',
  '/api/v1/minio/video',
];

const ignorePaths = ['/api/account/info', '/api/authenticate'];

const normalizeUrl = (url) => {
  return url.startsWith('/') ? url : `/${url}`;
};

const isPublicAPI = (url) => {
  const normalizedUrl = normalizeUrl(url);
  return publicAPI.some((api) => normalizedUrl.startsWith(api));
};

const isPathIgnored = (url) => {
  const normalizedUrl = normalizeUrl(url);
  return ignorePaths.some((api) => normalizedUrl.startsWith(api));
};

axiosInstance.interceptors.request.use(function (config) {
  if (isPublicAPI(config.url)) {
    return config;
  }

  const token = storageService.get(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error?.response?.status === 401 && !isPathIgnored(error.config.url)) {
      notification.info({
        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      });

      storageService.remove(ACCESS_TOKEN);
      storageService.set(PREVIOUS_PATH, window.location.pathname);

      setTimeout(() => {
        keycloakService.openLoginPage();
      }, 1000);

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
