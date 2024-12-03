import { axiosInstance } from '../configs/axiosConfig';

class AccountService {
  getUserInfo() {
    return axiosInstance.get('/api/account/info');
  }
}

export const accountService = new AccountService();
