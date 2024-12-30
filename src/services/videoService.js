import { axiosInstance } from '../configs/axiosConfig';

export const videoService = {
  generateToken(fileName) {
    return axiosInstance.get(
      `/api/v1/minio/video/token?fileName=${fileName}`
    );
  }
}