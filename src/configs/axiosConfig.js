import axios from 'axios';
import { keycloakService } from '../services/keycloakService';
import { storageService } from '../services/storageService';
import { ACCESS_TOKEN } from '../constants/storage';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
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

const isPublicAPI = (url) => {
  return publicAPI.some((api) => url.includes(api));
};

const isPathIgnored = (url) => {
  return ignorePaths.some((api) => url.includes(api));
};

axiosInstance.interceptors.request.use(function(config) {
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
  function(config) {
    return config;
  },
  function(error) {
    if (error.response) {
      if (error.response.status === 401 && !isPathIgnored(error.config.url)) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        storageService.remove(ACCESS_TOKEN);
        keycloakService.openLoginPage();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
