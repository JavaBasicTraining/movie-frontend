import { axiosInstance } from '../configs/axiosConfig';

export const EvaluationService = {
  getNumberOfReviews: (movieId) => {
    return axiosInstance.get(`/api/v1/evaluations/numberOfReviews/${movieId}`);
  },

  getAverageReviews: (movieId) => {
    return axiosInstance.get(`/api/v1/evaluations/average/${movieId}`);
  },
};
