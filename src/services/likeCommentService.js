import { axiosInstance } from "../configs/axiosConfig";

class LikeCommentService {
  like(commentId) {
    return axiosInstance.post(`/api/v1/like_comment/${commentId}`);
  }

  unlike(commentId) {
    return axiosInstance.delete(`/api/v1/like_comment/${commentId}`);
  }
}

export const likeCommentService = new LikeCommentService();
