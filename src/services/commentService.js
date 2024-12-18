import { axiosInstance } from '../configs/axiosConfig';
import { COMMENTS_PER_PAGE } from '../constants';

class CommentService {
  baseUrl = '/api/v1/comment';

  create(comment) {
    return axiosInstance.post(this.baseUrl, comment);
  }

  update(commentId, comment) {
    return axiosInstance.put(`${this.baseUrl}/${commentId}`, comment);
  }

  getComments(movieId, page, size, lastCommentCreatedDate) {
    const params = {
      movieId,
      page,
      size,
      lastCommentCreatedDate,
      sort: 'createdDate,desc',
    };
    return axiosInstance.get(`${this.baseUrl}`, { params });
  }

  getReplies(commentId, page = 0, size = COMMENTS_PER_PAGE) {
    const params = {
      page,
      size,
      sort: 'createdDate,desc',
    };
    return axiosInstance.get(`${this.baseUrl}/${commentId}/replies`, { params });
  }

  likeComment(commentId, isLike) {
    return axiosInstance.put(`${this.baseUrl}/${commentId}/like/${isLike}`);
  }

  getLikeCount(commentId) {
    return axiosInstance.get(`${this.baseUrl}/${commentId}/like-count`);
  }

  delete(commentId) {
    return axiosInstance.delete(`${this.baseUrl}/${commentId}`);
  }
}

export const commentService = new CommentService();