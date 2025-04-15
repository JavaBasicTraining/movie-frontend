import React, { useCallback, useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../configs/axiosConfig';
import { useLoaderData } from 'react-router-dom';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import VideoPlayer from '../../component/VideoPlayer';
import './WatchMovie.scss';
import { storageService } from '../../services';
import { ACCESS_TOKEN } from '../../constants/storage';
import { COMMENTS_PER_PAGE } from '../../constants/comment';
import { commentService } from '../../services/commentService';
import useFetchUser from '../../hooks/useFetchUser';

import { CommentInput } from '../../component/Comment/CommentInput/CommentInput';
import CommentList from '../../component/Comment/CommentList/CommentList';
import useWebSocket from '../../hooks/useWebSocket';
import { jwtDecode } from 'jwt-decode';

export const WatchMovie = () => {
  const { movie } = useLoaderData();
  const { user } = useFetchUser();
  const menuRef = useRef(null);
  const [listComment, setListComment] = useState([]);
  const [selectEpisode, setSelectEpisode] = useState([]);
  const [, setCurrentEpisodeIndex] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [jwt, setJwt] = useState(null);
  const { isConnected } = useWebSocket(setListComment, movie.id);

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

  const handleCommentChange = (e) => setCommentContent(e.target.value);

  const handleDeleteComment = (commentId) => {
    setListComment(listComment.filter((comment) => comment.id !== commentId));
  };

  const handleSubmitNewComment = async () => {
    if (!isConnected) {
      notification.error({
        message: 'WebSocket Error',
        description: 'Không thể kết nối WebSocket để gửi bình luận.',
      });
      return;
    }

    if (!jwt) {
      notification.warning({
        message: 'Login Required',
        description: 'Vui lòng đăng nhập để bình luận.',
      });
      return;
    }

    const request = {
      content: commentContent,
      user: {
        id: user.id,
        userName: user.userName,
      },
      movie: {
        id: movie.id,
      },
    };

    try {
      await commentService.create(request);
      setCommentContent('');
    } catch (error) {
      console.error('Create Comment Error:', error);
      notification.error({
        message: 'Post Comment Error',
        description: 'Không thể gửi bình luận.',
      });
    }
  };

  const getEpisodes = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/episode/${movie.id}`);
      setSelectEpisode(response.data);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  }, [movie.id]);

  const handleClickOutside = useCallback(
    (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (replyToCommentId) {
          setReplyToCommentId(null);
        }
      }
    },
    [replyToCommentId]
  );

  const fetchComment = useCallback(
    async (page = 0, size = COMMENTS_PER_PAGE) => {
      try {
        const response = await commentService.getComments(movie.id, page, size);
        setListComment(response.data);
      } catch (error) {
        notification.error({
          message: 'Fetch Comments Error',
          description: 'Unable to fetch comments.',
        });
      }
    },
    [movie.id]
  );

  useEffect(() => {
    if (isConnected) {
      console.log('Đã kết nối');
    }
  }, [isConnected]);

  useEffect(() => {
    const token = storageService.get(ACCESS_TOKEN);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setJwt(decodedToken);
        fetchComment().then();
      } catch (error) {
        notification.error({
          message: 'Invalid Token',
          description: 'Unable to decode token.',
        });
      }
    }

    getEpisodes().then();

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [fetchComment, getEpisodes, handleClickOutside]);

  return (
    <div className="container-movie">
      <div className="header-container">
        <div className="header">
          {movie.category.id === 1 ? (
            <>
              <VideoPlayer fileName={movie.videoUrl} controls />
              <div className="btn-episode">
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
            </>
          ) : (
            <VideoPlayer fileName={movie.videoUrl} controls />
          )}
        </div>

        <div className="like-share">
          <button>
            <LikeOutlined />
          </button>
          <button>
            <ShareAltOutlined />
          </button>
        </div>
        <div className="comment">
          <div className="input">
            <span className="title">Bình Luận</span>
            <CommentInput
              value={commentContent}
              onChange={handleCommentChange}
              onSubmit={handleSubmitNewComment}
              submitText="Bình luận"
              cancelText="Huỷ"
            />
          </div>

          <div className="list-comment">
            <CommentList
              comments={listComment}
              movieId={movie.id}
              onDeleted={handleDeleteComment}
            />
          </div>
        </div>
      </div>
      <h2>Trạng thái kết nối: {isConnected ? 'Đã kết nối' : 'Chưa kết nối'}</h2>
    </div>
  );
};
