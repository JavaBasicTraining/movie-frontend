import { axiosInstance } from '../configs/axiosConfig';

class GenreService {
  getAll() {
    return axiosInstance.get('api/v1/genre')
  }
}

export const genreService = new GenreService();
