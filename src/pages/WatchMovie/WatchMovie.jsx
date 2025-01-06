import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../configs/axiosConfig';
import { useLoaderData } from 'react-router-dom';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { notification } from 'antd'; // Import notification for user feedback
import { jwtDecode } from 'jwt-decode';
import VideoPlayer from '../../component/VideoPlayer';
import './WatchMovie.scss';
import { storageService } from '../../services/storageService';
import { ACCESS_TOKEN } from '../../constants/storage';
import { keycloak } from '../../configs/keycloak';
import { COMMENTS_PER_PAGE } from '../../constants/comment';
import { commentService } from '../../services/commentService';
import CommentList from '../../component/Comment/CommentList/CommentList';
import InfiniteScroll from 'react-infinite-scroll-component';
import useFetchUser from '../../hooks/useFetchUser';

import { CommentInput } from '../../component/Comment/CommentInput/CommentInput';

export const WatchMovie = () => {
  const [listComment, setListComment] = useState([]);
  const { movie } = useLoaderData();
  const { user } = useFetchUser();
  const [selectEpisode, setSelectEpisode] = useState([]);
  const [, setCurrentEpisodeIndex] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [editCommentContent, setEditCommentContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [jwt, setJwt] = useState(null);
  const menuRef = useRef(null);
  const [lastCommentCreatedDate, setLastCommentCreatedDate] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [replyComment, setReplyComment] = useState('');

  const getEpisodes = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/episode/${movie.id}`);
      setSelectEpisode(response.data);
    } catch (error) {
      console.error('Error fetching episodes:', error);
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
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      if (replyToCommentId) {
        setReplyToCommentId(null);
      }
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
          setListComment([res.data, ...listComment]);
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

  const fetchComment = async (page = 0, size = COMMENTS_PER_PAGE) => {
    try {
      const response = await commentService.getComments(
        movie.id,
        page,
        size,
        lastCommentCreatedDate
      );
      const newComments = response.data;
      const totalPages = response.headers['x-total-pages'];
      const updatedComments = [...listComment, ...newComments];
      setListComment(response.data);
      // setHasMore(updatedComments.length < totalPages);
      // setLastCommentCreatedDate(
      //   updatedComments[updatedComments.length - 1].createdDate
      // );
    } catch (error) {
      notification.error({
        message: 'Fetch Comments Error',
        description: 'Unable to fetch comments.',
      });
    }
  };
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

    getEpisodes();
  }, []);

  useEffect(() => {
    const token = storageService.get(ACCESS_TOKEN);
    if (token) {
      try {
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
            <span className='title'>Bình Luận</span>
            <CommentInput
              value={commentContent}
              onChange={handleCommentChange}
              onSubmit={handleSubmitNewComment}
              submitText="Bình luận"
              cancelText="Huỷ"
            />
          </div>
          <div className="list-comment">
            <CommentList comments={listComment} movieId={movie.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
