import React from 'react';
import CommentItem from '../CommentItem/CommentItem';

const CommentList = (props) => {
  const { comments = [], movieId } = props;
  return (
    <div className="commentList">
      {comments.map((comment) => 
        comment?.id ? (
          // <div>
          //   <span>{comment.content}</span>
          //   <span> {comment.user.userName}</span>
          // </div>
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            movieId={movieId} 
          />
        ) : null
      )}
    </div>
  );
  
};  

export default CommentList;


