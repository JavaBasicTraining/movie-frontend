import { axiosInstance } from "../configs/axiosConfig";

class EpisodeService {
  baseUrl = '/api/v1/episode';

  getEpisodes(movieId) {
    return axiosInstance.get(`${this.baseUrl}/${movieId}`);
  }
}

export const episodeService = new EpisodeService();

