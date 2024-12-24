import { axiosInstance } from '../configs/axiosConfig';

class MovieService {
  query(params) {
    return axiosInstance.get(`/api/v1/movies`, { params });
  }

  find(id) {
    return axiosInstance.get(`/api/v1/admin/movies/${id}`);
  }

  create(data) {
    return axiosInstance.post(`/api/v1/admin/movies`, data);
  }

  update(id, data) {
    return axiosInstance.put(`/api/v1/admin/movies/${id}`, data);
  }

  delete(movieId) {
    return axiosInstance.delete(`api/v1/admin/movies/${movieId}`);
  }

  updateMovieFile(movieId, file, type) {
    const formData = new FormData();
    console.log(file)
    formData.append('file', file);
    return axiosInstance.patch(
      `/api/v1/admin/movies/${movieId}?type=${type}`,
      formData
    );
  }

  updateEpisodeFile(movieId, episodeId, file, type) {
    const formDataPoster = new FormData();
    formDataPoster.append('file', file);
    return axiosInstance.patch(
      `/api/v1/admin/movies/${movieId}/episodes/${episodeId}?type=${type}`,
      formDataPoster
    );
  }
}

export const movieService = new MovieService();
