import React from 'react';

const CommentList = () => {
  const fetchComment = async () => {
    try {
      const params = new URLSearchParams({ movieId: movie.id });
      const response = await axiosInstance.get('/api/v1/comment', { params });
      setListComment(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      notification.error({
        message: 'Fetch Comments Error',
        description: 'Unable to fetch comments.',
      });
    }
  };
  return (
    <div>
      <span>Bình Luận</span>
      <div className="reply-input">
        <input
          className="input"
          type="text"
          value={comment}
          placeholder="Nhập bình luận của bạn..."
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
          required
        />
      </div>
    </div>
  );
};

export default CommentList;
