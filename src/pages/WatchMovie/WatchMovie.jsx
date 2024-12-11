import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLoaderData } from 'react-router-dom';
import { CommentInput, CommentList, VideoPlayer } from '../../component';
import { axiosInstance } from '../../configs/axiosConfig';
import { ACCESS_TOKEN, COMMENTS_PER_PAGE } from '../../constants';
import useFetchUser from '../../hooks/useFetchUser';
import { commentService, episodeService, storageService } from '../../services';
import './WatchMovie.scss';

export const WatchMovie = () => {
  const { movie } = useLoaderData();
  const { user } = useFetchUser();
  const [commentContent, setCommentContent] = useState('');
  const [listComment, setListComment] = useState([]);
  const [jwt, setJwt] = useState(null);
  const [selectEpisode, setSelectEpisode] = useState([]);
  const [, setCurrentEpisodeIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

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

  const fetchComment = async (page = 0, size = COMMENTS_PER_PAGE) => {
    try {
      const response = await commentService.getComments(movie.id, page, size);
      const newComments = response.data;
      const totalPages = response.headers['x-total-pages'];
      const updatedComments = [...listComment, ...newComments];
      console.log('totalPages: ', totalPages);
      console.log('updatedComments.length: ', updatedComments.length);
      setListComment(updatedComments);
      setHasMore(updatedComments.length < totalPages);
    } catch (error) {
      notification.error({
        message: 'Fetch Comments Error',
        description: 'Unable to fetch comments.',
      });
    }
  };

  const fetchMoreData = () => {
    const newPage = page + 1;
    setPage(newPage);

    fetchComment(newPage, COMMENTS_PER_PAGE);
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
        .then(() => {
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

        <div id="scrollableDiv" className="comment-section__body">
          <InfiniteScroll
            dataLength={listComment.length}
            next={fetchMoreData}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
            loader={<h4>Loading...</h4>}
          >
            <CommentList comments={listComment} movieId={movie.id} />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};
