import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../API/axiosConfig';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../../hooks/useAuth';

export async function filterMovieSeriesLoader({ params }) {
  const response = await axiosInstance.get(`/api/v1/movies/${params.id}`);

  return {
    movie: response.data,
  };
}

export const MovieVideoSeries = () => {
  const [comment, setComment] = useState('');
  const { movie } = useLoaderData();
  const [selectEpisode, setSelectEpisode] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [listComment, setListComment] = useState([]);
  const [user, setUser] = useState([]);
  const [jwt, setJwt] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const { token } = useAuth();

  const fetchUser = async (userName) => {
    try {
      const response = await axiosInstance.get(`/api/account/getUser`, {
        params: { userName },
      });
      setUser(response.data ?? []);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const getEpisodes = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/episode/getEpisodeByMovieId/${movie.id}`
      );
      setSelectEpisode(response.data);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setJwt(decodedToken);
      fetchUser(decodedToken.sub);
      fetchComment();
      setShowComment(true);
    }
  }, []);

  const fetchComment = async () => {
    try {
      const params = new URLSearchParams({ movieId: movie.id });
      const response = await axiosInstance.get('/api/v1/comment', {
        params: params,
      });
      setListComment(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

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
          user: user.userName,
          idMovie: [movie.id],
        };
        await axiosInstance.put(`/api/v1/comment/update`, request, {
          params: {
            commentId: editCommentId,
          },
        });
        fetchComment();
        setEditCommentId(null);
        setEditCommentContent('');
      } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật bình luận:', error);
      }
    }
  };

  const handleDelete = async (params) => {
    try {
      await axiosInstance.delete(`/api/v1/comment/delete/${params}`);
      alert(`Xóa Thành Công!!`);
      fetchComment();
    } catch (error) {
      console.error('Có lỗi xảy ra khi xóa bình luận:', error);
    }
  };

  const handleSelectEpisode = async (episodeId) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/episode/getEpisodeByMovieId/movieId/${movie.id}/episode/${episodeId}`
      );
      setCurrentEpisodeIndex(response.data);
    } catch (error) {
      console.error('Error fetching episode:', error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (jwt) {
        const request = new FormData();
        request.append('content', comment);
        request.append('idUser', user.id);
        request.append('idMovie', movie.id);

        try {
          await axiosInstance.post(`/api/v1/comment/create`, request);
          fetchComment();
          setComment('');
        } catch (error) {
          console.error('Error posting comment:', error);
          alert('Có lỗi xảy ra khi đăng bình luận.');
        }
      } else {
        alert('Bạn phải đăng nhập');
      }
    }
  };

  const handleEditClick = (commentId, content) => {
    setEditCommentId(commentId);
    setEditCommentContent(content);
  };

  useEffect(() => {
    getEpisodes();
  }, []);

  return (
    <div className="container">
      <div className="header-container">
        <div className="header">
          <video src={currentEpisodeIndex.videoUrl} controls />
        </div>
        <div className="btn-next-movie">
          <button>Tập Trước</button>
          {selectEpisode &&
            selectEpisode.map((item) => (
              <button
                onClick={() => handleSelectEpisode(item.episodeCount)}
                key={item.id}
              >
                {item.episodeCount}
              </button>
            ))}
          <button>Tập Sau</button>
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
        <div className="comment-section">
          {showComment &&
            listComment.map((value) => (
              <div className="show-comment" key={value.id}>
                <div className="comment-header">
                  <h1>@{value.user.userName}:</h1>
                  {editCommentId === value.id ? (
                    <div className="edit-comment">
                      <input
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        onKeyDown={handleKeyDownUpdateComment}
                      />
                      <div className="edit-comment-buttons">
                        <button onClick={handleUpdateComment}>Lưu</button>
                        <button onClick={() => setEditCommentId(null)}>
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="comment-content">
                      <label>{value.content}</label>
                      <div className="comment-options">
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
                    </div>
                  )}
                </div>
              </div>
            ))}
          <div className="comment-form">
            <span>Bình Luận</span>
            <input
              className="input"
              type="text"
              value={comment}
              placeholder="Nhập bình luận của bạn..."
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
