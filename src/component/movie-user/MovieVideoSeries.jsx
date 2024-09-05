import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../API/axiosConfig';
import { useLoaderData } from 'react-router-dom';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';

export async function filterMovieSeriesLoader({ params }) {
  const response = await axiosInstance.get(
    `/api/v1/movies/name/${params.name}`
  );

  return {
    movie: response.data,
  };
}

export const MovieVideoSeries = () => {
  const [comment, setComment] = useState('');
  const { movie } = useLoaderData();
  const [selectEpisode, setSelectEpisode] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (isLoggedIn()) {
        alert('Comment Thành Công!!!');
      } else {
        alert(`Bạn phải đăng nhập`);
      }
    }
  };

  // useEffect(()=>
  // {
  //   handleSelectEpisode(1);
  // },[currentEpisodeIndex])

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

  // const handleNextEpisode = () => {
  //   setCurrentEpisodeIndex((prevIndex) => {
  //     const newIndex = prevIndex + 1;
  //     console.log(newIndex < selectEpisode.length ? newIndex : prevIndex);

  //     return newIndex < selectEpisode.length ? newIndex : prevIndex;
  //   });
  // };

  useEffect(() => {
    getEpisodes();
  }, []); // Chỉ chạy một lần khi component được mount

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
        <div className="comment">
          <span>Bình Luận</span>
          <input
            className="input"
            type="text"
            value={comment}
            placeholder="Nhập bình luận của bạn..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          ></input>
        </div>
      </div>
    </div>
  );
};
