import { axiosInstance } from '../configs/axiosConfig';

class CommentService {
  baseUrl = '/api/v1/comment';

  create(comment) {
    return axiosInstance.post(this.baseUrl, comment);
  }

  update(commentId, comment) {
    return axiosInstance.put(`${this.baseUrl}/${commentId}`, comment);
  }

  getComments(movieId) {
    return axiosInstance.get(`${this.baseUrl}?movieId=${movieId}`);
  }

  likeComment(commentId, isLike) {
    return axiosInstance.put(`${this.baseUrl}/${commentId}/like/${isLike}`);
  }

  getLikeCount(commentId) {
    return axiosInstance.get(`${this.baseUrl}/${commentId}/like-count`);
  }
}

export const commentService = new CommentService();
