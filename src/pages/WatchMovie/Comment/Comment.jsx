import { notification } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { axiosInstance } from '../../../configs/axiosConfig';
import { storageService } from '../../../services/storageService';
import { ACCESS_TOKEN } from '../../../constants/storage';
import { jwtDecode } from 'jwt-decode';
import './Comment.scss';

const Comment = memo(() => {
  const [comment, setComment] = useState('');
  const [listComment, setListComment] = useState([]);
  const [listReplies, setListReplies] = useState([]);
  const [showReplies, setShowReplies] = useState({}); // Object to track visibility of replies for each comment

  const [user, setUser] = useState({});
  const menuRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const { movie } = useLoaderData();
  const [jwt, setJwt] = useState(null);
  const [replyComment, setReplyComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const toggleRepliesVisibility = (commentId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId], // Toggle the visibility of replies for the specific comment
    }));
  };
  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (jwt && replyToCommentId) {
        const request = {
          content: replyComment,
          idUser: user.id,
          idMovie: movie.id,
          user: user,
          parentCommentId: replyToCommentId,
        };

        try {
          await axiosInstance.post(`/api/v1/comment/create`, request);
          await fetchComment();
          setReplyComment('');
          setReplyToCommentId(null);
        } catch (error) {
          console.error('Error posting reply:', error);
          notification.error({
            message: 'Post Reply Error',
            description: 'Unable to post reply.',
          });
        }
      } else if (jwt) {
        const request = {
          content: comment,
          idUser: user.id,
          idMovie: movie.id,
          user: user.userName,
        };

        if (replyToCommentId) {
          request.append('replyToCommentId', replyToCommentId);
        }

        try {
          await axiosInstance.post(`/api/v1/comment/create`, request);
          fetchComment();
          fetchReplies();
          setComment('');
          setReplyToCommentId(null);
        } catch (error) {
          console.error('Error posting comment:', error);
          notification.error({
            message: 'Post Comment Error',
            description: 'Unable to post comment.',
          });
        }
      } else {
        notification.warning({
          message: 'Login Required',
          description: 'Please log in to post a comment.',
        });
      }
    }
  };

  const toggleOptions = (commentId) => {
    setShowOptions((prevState) => {
      const newState = {
        ...prevState,
        [commentId]: !prevState[commentId],
      };

      Object.keys(newState).forEach((key) => {
        if (key !== commentId.toString()) {
          newState[key] = false;
        }
      });
      return newState;
    });
    if (replyToCommentId && replyToCommentId !== commentId) {
      setReplyToCommentId(null);
    }
    if (editCommentId && editCommentId !== commentId) {
      setEditCommentId(null);
      setEditCommentContent('');
    }
  };

  const fetchUser = async (userName) => {
    try {
      const response = await axiosInstance.get(`/api/account/getUser`, {
        params: { userName },
      });
      setUser(response.data ?? {});
    } catch (error) {
      console.error('Error fetching user:', error);
      notification.error({
        message: 'Fetch User Error',
        description: 'Unable to fetch user data.',
      });
    }
  };

  const fetchComment = async () => {
    try {
      const params = new URLSearchParams({ movieId: movie.id });
      const response = await axiosInstance.get('/api/v1/comment', { params });
      setListComment(response.data);
      console.log(listComment);
    } catch (error) {
      console.error('Error fetching comments:', error);
      notification.error({
        message: 'Fetch Comments Error',
        description: 'Unable to fetch comments.',
      });
    }
  };

  const fetchReplies = async () => {
    try {
      const updatedComments = await Promise.all(
        listComment.map(async (item) => {
          const params = new URLSearchParams({
            movieId: movie.id,
            parentComment: item.id,
          });
          const response = await axiosInstance.get(
            '/api/v1/comment/get-replies',
            { params }
          );
          console.log('Fetched comments:', response.data);
          return response.data;
        })
      );
      setListReplies(updatedComments.flat());
    } catch (error) {
      console.error('Error fetching comments:', error);
      notification.error({
        message: 'Fetch Comments Error',
        description: 'Unable to fetch comments.',
      });
    }
  };

  const getTimeDifference = (currentDate) => {
    const now = new Date();
    const commentTime = new Date(currentDate);
    const timeDifference = now - commentTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (minutesDifference < 1) return 'Vừa xong';
    if (minutesDifference < 60) return `${minutesDifference} phút trước`;
    if (hoursDifference < 24) return `${hoursDifference} giờ trước`;
    if (daysDifference <= 7) return `${daysDifference} ngày trước`;

    const day = commentTime.getDate();
    const month = commentTime.getMonth() + 1;
    const year = commentTime.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleKeyDownUpdateComment = (e, parentCommentId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUpdateComment(parentCommentId);
    }
  };

  const handleUpdateComment = async (parentCommentId) => {
    if (editCommentId && editCommentContent) {
      try {
        const request = {
          content: editCommentContent,
          idUser: user.id,
          idMovie: movie.id,
          user: user,
          parentCommentId: comment.id,
        };
        await axiosInstance.put(`/api/v1/comment/update`, request, {
          params: { commentId: editCommentId },
        });
        fetchComment();

        fetchReplies();
        setEditCommentId(null);
        setEditCommentContent('');
      } catch (error) {
        console.error('Error updating comment:', error);
        notification.error({
          message: 'Update Comment Error',
        });
      }
    } else if (editReplyId && editReplyContent) {
      try {
        const request = {
          content: editReplyContent,
          idUser: user.id,
          idMovie: movie.id,
          parentCommentId: parentCommentId,
        };
        await axiosInstance.put(`/api/v1/comment/update`, request, {
          params: { commentId: editReplyId },
        });
        fetchComment();
        fetchReplies();
        setEditReplyId(null);
        setEditReplyContent('');
      } catch (error) {
        console.error('Error updating reply:', error);
        notification.error({
          message: 'Update Reply Error',
        });
      }
    }
  };
  const handleEditReplyClick = (replyId, content) => {
    setEditReplyId(replyId);
    setEditReplyContent(content);
  };
  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/api/v1/comment/${commentId}`);
      notification.success({
        message: 'Success',
        description: 'Comment deleted successfully.',
      });
      fetchComment();
      fetchReplies();
    } catch (error) {
      console.error('Error deleting comment:', error);
      notification.error({
        message: 'Delete Comment Error',
      });
    }
  };

  const handleEditClick = (commentId, content) => {
    setEditCommentId(commentId);
    setEditCommentContent(content);
    setShowOptions({ [commentId]: true });
  };

  const handleReply = (commentId) => setReplyToCommentId(commentId);

  const handleClickLike = async (commentId) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/like-comment/user/${user.id}/movie/${movie.id}`
      );
      const likedComment = response.data.find(
        (item) => item.idComment === commentId
      );

      if (!likedComment) {
        const request = {
          idUser: user.id,
          idMovie: movie.id,
          idComment: commentId,
        };
        await axiosInstance.post('/api/v1/like-comment', request);
      } else {
        await axiosInstance.delete(`/api/v1/like-comment/${likedComment.id}`);
      }
      fetchComment();
      fetchReplies();
    } catch (error) {
      console.error('Error liking comment:', error);
      notification.error({
        message: 'Like Comment Error',
        description: 'Unable to like comment.',
      });
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.options')) {
      setShowOptions({});
      if (replyToCommentId) {
        setReplyToCommentId(null);
      }
    }
  };

  // useEffect(() => {
  //   // document.addEventListener('click', handleClickOutside);
  //   return () => {
  //     // document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [showOptions]);
  useEffect(() => {
    const token = storageService.get(ACCESS_TOKEN);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setJwt(decodedToken);
        fetchUser(decodedToken.preferred_username).then();
        fetchComment().then();
        fetchReplies().then();
        setShowComment(true);
      } catch (error) {
        notification.error({
          message: 'Invalid Token',
          description: 'Unable to decode token.',
        });
      }
    }
  }, [, movie.id,listComment.id,]);

  return (
    <div className="body-comment">
      <div className="comment">
        {showComment &&
          listComment
            .filter((value) => value.parentCommentId == null)
            .map((value) => (
              <div className="show-comment" key={value.id}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <h1>@{value.user.userName}: </h1>
                  <label>{getTimeDifference(value.currentDate)}</label>
                </div>

                <div className="comment-item">
                  {editCommentId === value.id ? (
                    <div className="edit-comment">
                      <input
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        onKeyDown={handleKeyDownUpdateComment}
                      />
                      <div className="save-cancel">
                        <button onClick={handleUpdateComment}>Lưu</button>
                        <button
                          onClick={() => {
                            setEditCommentId(null);
                            setEditCommentContent('');
                            setShowOptions((prev) => {
                              const newState = { ...prev };
                              delete newState[editCommentId];
                              return newState;
                            });
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="content-icon">
                      <label>{value.content}</label>
                      <div ref={menuRef} className="comment-options">
                        <div className="edit-comment">
                          <button
                            className="options"
                            onClick={() => toggleOptions(value.id)}
                          >
                            ...
                          </button>
                          {showOptions[value.id] && (
                            <div className="choose-update-delete">
                              <button
                                onClick={() =>
                                  handleEditClick(value.id, value.content)
                                }
                              >
                                Chỉnh Sửa
                              </button>
                              <button onClick={() => handleDelete(value.id)}>
                                Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="like-reply">
                  <div className="like-total">
                    <button onClick={() => handleClickLike(value.id)}>
                      Like
                    </button>
                    <label>{value.totalLikes}</label>
                  </div>
                  <button onClick={() => handleReply(value.id)}>Reply</button>
                </div>
                <button className='show-'
                  onClick={() => toggleRepliesVisibility(value.id)}
                >
{showReplies[value.id] ? "Ẩn Reply" : `${listReplies.length} Reply`}
                </button>

                {showReplies[value.id] && listReplies && listReplies.length > 0 && (
                  <div className="replies">
                    {listReplies.map((reply) => (
                      <div key={reply.id} className="reply-item">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <h2>@{reply.user.userName}:</h2>
                          <label>{getTimeDifference(reply.currentDate)}</label>
                        </div>
                        <div className="content-icon">
                          {editReplyId === reply.id ? (
                            <div className="edit-reply">
                              <input
                                value={editReplyContent}
                                onChange={(e) =>
                                  setEditReplyContent(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  handleKeyDownUpdateComment(
                                    e,
                                    reply.parentCommentId
                                  )
                                }
                              />
                              <div className="save-cancel">
                                <button
                                  onClick={() =>
                                    handleUpdateComment(reply.parentCommentId)
                                  }
                                >
                                  Lưu
                                </button>
                                <button
                                  onClick={() => {
                                    setEditReplyId(null);
                                    setEditReplyContent('');
                                    setShowOptions((prev) => {
                                      const newState = { ...prev };
                                      delete newState[editReplyId];
                                      return newState;
                                    });
                                  }}
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <label>{reply.content}</label>
                              <div ref={menuRef} className="reply-options">
                                <button
                                  className="options"
                                  onClick={() => toggleOptions(reply.id)}
                                >
                                  ...
                                </button>
                                {showOptions[reply.id] && (
                                  <div className="choose-update-delete">
                                    <button
                                      onClick={() =>
                                        handleEditReplyClick(
                                          reply.id,
                                          reply.content
                                        )
                                      }
                                    >
                                      Chỉnh Sửa
                                    </button>
                                    <button
                                      onClick={() => handleDelete(reply.id)}
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="like-reply">
                          <div className="like-total">
                            <button onClick={() => handleClickLike(reply.id)}>
                              Thích
                            </button>
                            <label>{reply.totalLikes}</label>
                          </div>
                          <button onClick={() => handleReply(reply.id)}>
                            Trả lời
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyToCommentId === value.id && (
                  <div className="reply-input">
                    <input
                      className="input"
                      type="text"
                      value={replyComment}
                      placeholder="Nhập phản hồi của bạn..."
                      onChange={(e) => setReplyComment(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                    <button onClick={() => setReplyToCommentId(null)}>
                      Hủy Reply
                    </button>
                  </div>
                )}
              </div>
            ))}

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
    </div>
  );
});

export default Comment;
