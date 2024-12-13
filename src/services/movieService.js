import { axiosInstance } from "../configs/axiosConfig";

class MovieService {
  query(params) {
    return axiosInstance.get(`/api/v1/movies`, { params });
  }

  delete(movieId) {
    return axiosInstance.delete(`api/v1/admin/movies/${movieId}`);
  }
}

export const movieService = new MovieService();
