import { axiosInstance } from '../configs/axiosConfig';

export const accountService = {
  getUser: () => {
    return axiosInstance.get('/api/account/info');
  },
};
