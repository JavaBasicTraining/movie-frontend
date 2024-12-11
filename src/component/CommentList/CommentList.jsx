import React from 'react';
import PropTypes from 'prop-types';
import { CommentItem } from '../CommentItem/CommentItem';
import './CommentList.scss';

export function CommentList(props) {
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
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  movieId: PropTypes.number.isRequired,
  onDeleted: PropTypes.func.isRequired,
};
