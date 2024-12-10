import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import CommentInput from '../../component/CommentInput/CommentInput';
import CommentList from '../../component/CommentList/CommentList';
import VideoPlayer from '../../component/VideoPlayer';
import { axiosInstance } from '../../configs/axiosConfig';
import { ACCESS_TOKEN } from '../../constants/storage';
import { commentService } from '../../services/commentService';
import { episodeService } from '../../services/episodeService';
import { storageService } from '../../services/storageService';
import './WatchMovie.scss';

export const WatchMovie = () => {
  const [commentContent, setCommentContent] = useState('');
  const [listComment, setListComment] = useState([]);
  const { movie } = useLoaderData();
  const [user, setUser] = useState({});
  const [jwt, setJwt] = useState(null);
  const [selectEpisode, setSelectEpisode] = useState([]);
  const [, setCurrentEpisodeIndex] = useState(0);

  const getEpisodes = useCallback(() => {
    episodeService
      .getEpisodes(movie.id)
      .then((res) => {
        setSelectEpisode(res.data);
      })
      .catch((error) => {
        console.error('Error fetching episodes:', error);
      });
  }, [movie.id]);

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
      const response = await commentService.getComments(movie.id);
      setListComment(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      notification.error({
        message: 'Fetch Comments Error',
        description: 'Unable to fetch comments.',
      });
    }
  };

  const handleCommentChange = (e) => setCommentContent(e.target.value);

  const handleSubmitNewComment = async () => {
    if (jwt) {
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

      commentService
        .create(request)
        .then((res) => {
          fetchComment();
          setCommentContent('');
        })
        .catch((error) => {
          console.error('Error posting comment:', error);
          notification.error({
            message: 'Post Comment Error',
            description: 'Unable to post comment.',
          });
        });
    } else {
      notification.warning({
        message: 'Login Required',
        description: 'Please log in to post a comment.',
      });
    }
  };

  useEffect(() => {
    const token = storageService.get(ACCESS_TOKEN);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setJwt(decodedToken);
        fetchUser(decodedToken.preferred_username).then();
        fetchComment().then();
      } catch (error) {
        notification.error({
          message: 'Invalid Token',
          description: 'Unable to decode token.',
        });
      }
    }

    getEpisodes();
  }, []);

  return (
    <div className="container-movie">
      <div className="header-container">
        <div className="header">
          {movie.category.id === 1 ? (
            <>
              <VideoPlayer fileName={movie.videoUrl} controls />
              <div className="btn-episode">
                <button>Tập Trước</button>
                {selectEpisode?.map((item) => (
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
      </div>

      <div className="comment-section">
        <div className="comment-section__header">
          <span>Bình Luận</span>
          <CommentInput
            value={commentContent}
            onChange={handleCommentChange}
            onSubmit={handleSubmitNewComment}
            submitText="Bình luận"
            cancelText="Huỷ"
          />
        </div>

        <CommentList comments={listComment} movieId={movie.id} />
      </div>
    </div>
  );
};
