import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../configs/axiosConfig';
import { useLoaderData } from 'react-router-dom';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';

import VideoPlayer from '../../component/VideoPlayer';
import './WatchMovie.scss';

import Comment from './Comment/Comment';

export const WatchMovie = () => {
  const { movie } = useLoaderData();

  const [selectEpisode, setSelectEpisode] = useState([]);
  const [, setCurrentEpisodeIndex] = useState(0);


  useEffect(() => {
    getEpisodes().then();
  }, []);

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
      </div>

      <Comment />
    </div>
  );
};
