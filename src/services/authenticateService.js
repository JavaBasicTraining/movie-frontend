import { axiosInstance } from '../configs/axiosConfig';

export const authenticateService = {
  authenticate: () => {
    return axiosInstance.get('api/authenticate');
  },
};
