import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../API/axiosConfig';
import { useLoaderData } from 'react-router-dom';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { notification } from 'antd'; 
import { jwtDecode } from 'jwt-decode';
import useAuth from '../../hook/useAuth';
import VideoPlayer from './Videos';

export async function filterMovieLoader({ params }) {
  const response = await axiosInstance.get(
    `/api/v1/movies/${params.id}`
  );
  return { movie: response.data };
}

export const MovieVideo = () => {
  const [comment, setComment] = useState('');
  const [listComment, setListComment] = useState([]);
  const { movie } = useLoaderData();
  const [user, setUser] = useState({});
  const [jwt, setJwt] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);
  const [replyComment, setReplyComment] = useState('');
  const {token} = useAuth();










  
  const handleClickReply= async ()=>
  {
    if (jwt && replyToCommentId) {
      const request = {
        content: replyComment,
        idUser: user.id,
        idMovie: movie.id,
        user: user,
        replyToCommentId:  replyToCommentId
      }

      try {
        await axiosInstance.post(`/api/v1/comment/create`, request);
        fetchComment();
        setReplyComment('');
        setReplyToCommentId(null);
      } catch (error) {
        console.error('Error posting reply:', error);
        notification.error({
          message: 'Post Reply Error',
          description: 'Unable to post reply.',
        });
      }
    }
  }
  const handleKeyDownReply = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClickReply()
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowOptions({});
      if (replyToCommentId) {
        setReplyToCommentId(null);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const toggleOptions = (commentId) => {
    setShowOptions((prevState) => {
      const newShowOptions = {
        ...prevState,
        [commentId]: !prevState[commentId],
      };


      if (replyToCommentId && replyToCommentId !== commentId) {
        setReplyToCommentId(null);
      }

      return newShowOptions;
    });
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setJwt(decodedToken);
        fetchUser(decodedToken.preferred_username);
        fetchComment();
        setShowComment(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        notification.error({
          message: 'Invalid Token',
          description: 'Unable to decode token.',
        });
      }
    }
  }, []);

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

  const handleKeyDownUpdateComment = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUpdateComment();
    }
  };

  const handleUpdateComment = async () => {
    if (editCommentId && editCommentContent) {
      try {
        const request = {
          content: editCommentContent,
          idUser: user.id,
          idMovie: movie.id,
        };
        await axiosInstance.put(`/api/v1/comment/update`, request, {
          params: { commentId: editCommentId },
        });
        fetchComment();
        setEditCommentId(null);
        setEditCommentContent('');
      } catch (error) {
        console.error('Error updating comment:', error);
        notification.error({
          message: 'Update Comment Error',
        });
      }
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/api/v1/comment/${commentId}`);
      notification.success({
        message: 'Success',
        description: 'Comment deleted successfully.',
      });
      fetchComment();
    } catch (error) {
      console.error('Error deleting comment:', error);
      notification.error({  
        message: 'Delete Comment Error',
      });
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (jwt) {
        const request = {
          content: comment,
          idUser: user.id,
          idMovie: movie.id,
          user: user,
          replyToCommentId: replyToCommentId || null,
        };
  
        try {
          await axiosInstance.post(`/api/v1/comment/create`, request);
          fetchComment(); 
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
  

  const handleEditClick = (commentId, content) => {
    setEditCommentId(commentId);
    setEditCommentContent(content);
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
    } catch (error) {
      console.error('Error liking comment:', error);
      notification.error({
        message: 'Like Comment Error',
        description: 'Unable to like comment.',
      });
    }
  };

  return (
    <div className="container-movie">
      <div className="header-container">
        <div className="header">
        <VideoPlayer fileName="movies/112/video/doibongthieulam.mp4" controls />
        </div>
        <div className="like-share">
          <button>
            <LikeOutlined />
          </button>
          <button>
            <ShareAltOutlined />
          </button>
        </div>
      </div>

      <div className="body">
        <div className="comment">
          {showComment &&
            listComment.map((value) => (
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
                            setShowOptions(false);
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
                          <button onClick={() => toggleOptions(value.id)}>
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
                  <button onClick={() => handleClickLike(value.id)}>
                    Like
                  </button>
                  <label
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      marginRight: '15px',
                    }}
                  >
                    {value.totalLikes}
                  </label>
                  <button onClick={() => handleReply(value.id)}>Reply</button>
                </div>
                {replyToCommentId === value.id && (
                  <div className="reply-input">
                    <input
                      className="input"
                      type="text"
                      value={replyComment}
                      placeholder="Nhập phản hồi của bạn..."
                      onChange={(e) => setReplyComment(e.target.value)}
                      onKeyDown={handleKeyDownReply}
                      required
                    />
                    <button onClick={handleClickReply}>
                      Reply
                    </button>
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
    </div>
  );
};