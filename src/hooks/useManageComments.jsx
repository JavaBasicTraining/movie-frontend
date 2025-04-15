export const useManageComments = () => {
  const updateOrAddComment = (comments, data) => {
    return comments.map((comment) => {
      if (comment.id === data.parentCommentId) {
        const updatedReplies = [
          ...(comment.replies ?? []).filter((reply) => reply.id !== data.id),
          data,
        ];
        return {
          ...comment,
          replies: updatedReplies,
          totalReplies: updatedReplies.length,
        };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateOrAddComment(comment.replies, data),
        };
      }

      return comment;
    });
  };

  const handleDeleteComment = (comments, idToDelete) => {
    return comments
      .filter((comment) => comment.id !== idToDelete)
      .map((comment) => ({
        ...comment,
        replies: handleDeleteComment(comment.replies ?? [], idToDelete),
        totalReplies: handleDeleteComment(comment.replies ?? [], idToDelete)
          .length,
      }));
  };

  const handleAddComment = (newComment, prevComments = []) => {
    if (newComment.parentCommentId) {
      return prevComments.map((comment) => {
        if (comment.id === newComment.parentCommentId) {
          comment.replies = [...(comment.replies ?? []), newComment];
          comment.totalReplies = comment.replies.length - 1;
          return comment;
        }
        return {
          ...comment,
          replies: handleAddComment(newComment, comment.replies ?? []),
        };
      });
    }

    return [...(prevComments ?? []), newComment];
  };

  const findAndUpdateComment = (updatedComment, prevComments) => {
    return prevComments.map((comment) => {
      if (comment.id === updatedComment.id) {
        return {
          ...comment,
          ...updatedComment,
        };
      }
      return comment;
    });
  };

  const handleUpdateComment = (updatedComment, prevComments = []) => {
    console.log(
      updatedComment.id,
      updatedComment.parentCommentId,
      updatedComment.content
    );
    console.log(JSON.stringify(prevComments));

    if ((prevComments?.length ?? 0) <= 0) {
      return prevComments;
    }

    if (updatedComment.parentCommentId) {
      return prevComments.map((comment) => {
        if (comment.id === updatedComment.parentCommentId) {
          console.log('founded');
          return findAndUpdateComment(updatedComment, comment.replies ?? []);
        }
        console.log('go deeper: ', comment.replies);
        return {
          ...comment,
          replies: handleUpdateComment(updatedComment, comment.replies ?? []),
        };
      });
    }

    return findAndUpdateComment(updatedComment, prevComments);
  };

  const handleCommentMessage = (comment, setListComment, action) => {
    setListComment((prevComments) => {
      switch (action) {
        case 'ADD':
          return handleAddComment(comment, prevComments);
        case 'UPDATE': {
          return handleUpdateComment(comment, prevComments);
        }
        case 'DELETE': {
          return handleDeleteComment(prevComments, comment);
        }
        default:
          return prevComments;
      }
    });
  };

  return {
    handleCommentMessage,
  };
};
