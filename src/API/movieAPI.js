import { axiosInstance } from './axiosConfig';

export const movieAPI = {
  uploadFile: (id, type, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosInstance.patch(
      `/api/v1/admin/movies/${id}?type=${type}`,
      formData
    );
  },
  create: (data) => {
    return axiosInstance.post(`/api/v1/admin/movies`, data);
  },
  update: (id, data) => {
    return axiosInstance.put(`/api/v1/admin/movies/${id}`, data);
  },
};
