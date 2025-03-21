import React from 'react';
import './CommentList.scss';
import CommentItem from '../CommentItem/CommentItem';
const CommentList = (props) => {
  const { comments = [], movieId, onDeleted } = props;
  return (
    <div className="comment-list common-scrollbar">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          movieId={movieId}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
};

export default CommentList;