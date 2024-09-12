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
  '/api/v1/episode/getEpisodeByMovieId',
];

axiosInstance.interceptors.request.use(
  function (config) {
    const isPublicAPI = publicAPI.some((api) => config.url.includes(api));
    if (isPublicAPI) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    window.location.href = '/login';
    return Promise.reject(error);
  }
);
