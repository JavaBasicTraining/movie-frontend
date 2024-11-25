import axios from 'axios';

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

axiosInstance.interceptors.request.use(function (config) {
  if (isPublicAPI(config.url)) {
    return config;
  }

  const token = localStorage.getItem('access_token');
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
    if (error.response) {
      console.log('Error response:', error.response);
      if (error.response.status === 401 && !isPathIgnored(error.config.url)) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Xử lý các lỗi khác
    return Promise.reject(error);
  }
);
