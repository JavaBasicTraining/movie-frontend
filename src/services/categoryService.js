import { axiosInstance } from '../configs/axiosConfig';

export const categoryService = {
  getAll() {
    return axiosInstance.get(`/api/v1/category`);
  },
};
