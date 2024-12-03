import { axiosInstance } from "../configs/axiosConfig";

class MovieService {
  query(params) {
    return axiosInstance.get(`/api/v1/movies`, { params });
  }

  getMovieDetail(movieId) {
    return axiosInstance.get(`/api/v1/movies/${movieId}`);
  }

  delete(movieId) {
    return axiosInstance.delete(`api/v1/admin/movies/${movieId}`);
  }
}

export const movieService = new MovieService();
