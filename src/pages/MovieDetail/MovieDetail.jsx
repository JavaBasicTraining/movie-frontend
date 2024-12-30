import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../configs';
import { useLoaderData, useNavigate } from 'react-router-dom';
import './MovieDetail.scss';
import { movieService } from '../../services';
import { Avatar, Flex, Rate } from 'antd';
import { VideoPlayer } from '../../component';

export async function MovieDetailLoader({ params }) {
  const response = await movieService.findByPath(params.path);
  return {
    movie: response.data,
  };
}

export const MovieDetail = () => {
  const { movie } = useLoaderData();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [isShowTrailer, setIsShowTrailer] = useState(false);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
    return () => {
      window.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  useEffect(() => {
    averageRating(movie.id).then();
    evaluationsNumberReview(movie.id).then();
  }, [average, movie.id, rating]);

  const evaluationsNumberReview = async (params) => {
    const response = await axiosInstance.get(
      `/api/v1/evaluations/numberOfReviews/${params}`
    );
    setRating(response.data);
  };

  const averageRating = async (params) => {
    const response = await axiosInstance.get(
      `/api/v1/evaluations/average/${params}`
    );
    setAverage(response.data);
  };

  const handleKeyup = (e) => {
    if (e.code === 'Escape') {
      setIsShowTrailer(false);
    }
  };

  const handleWatchTrailer = () => {
    setIsShowTrailer(true);
  };

  const handleWatchNow = () => {
    navigate(`/xem-phim/${movie?.path}`);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  return (
    <Flex className="MovieDetail" gap={10} vertical>
      <div className="MovieDetail__banner">
        <img
          className="MovieDetail__image"
          src={movie?.posterPresignedUrl}
          alt=""
        />
      </div>

      <Flex className="MovieDetail__content" gap={50}>
        <Flex className="MovieDetail__movie-info" vertical gap={10}>
          <>
            <span className="MovieDetail__movie-title f-large">
              {movie?.nameMovie}
            </span>
            <span className="f-medium">
              Release Date: {movie?.createdDate ?? new Date().toDateString()}
            </span>
            <span className="f-medium">
              Genres: {movie?.genres.map((genre) => genre.name)?.join(', ')}
            </span>

            <Flex vertical>
              <span className="f-large">Description</span>
              <span className="MovieDetail__description f-medium">
                {movie?.description}
              </span>
            </Flex>
          </>
        </Flex>

        <Flex className="MovieDetail__rating-and-cast" vertical gap={10}>
          <Flex vertical className="MovieDetail__rating" gap={10}>
            <span className="f-large">Rating</span>
            <Rate defaultValue={rating} onChange={handleRating} />
          </Flex>

          <Flex className="MovieDetail__cast" vertical gap={10}>
            <span className="f-large">Cast & Crew</span>
            <Flex vertical gap={10}>
              <>
                {Array(3)
                  .fill('')
                  .map((_, index) => (
                    <Flex key={`${index.toString()}`} gap={10} align="center">
                      <Avatar size={48} />
                      <Flex vertical gap={0}>
                        <span className="f-medium">Huy Ha</span>
                        <span className="f-small">Director, Writer</span>
                      </Flex>
                    </Flex>
                  ))}
              </>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex className="MovieDetail__actions" justify="center" gap={10}>
        <button className="btn">Watch Together</button>
        <button className="btn btn-primary" onClick={handleWatchNow}>
          Watch Now
        </button>
        <button className="btn" onClick={handleWatchTrailer}>
          Watch Trailer
        </button>
      </Flex>

      {isShowTrailer && (
        <div className="MovieDetail__trailer-overlay">
          <div
            className="MovieDetail__trailer-backdrop"
            onClick={() => setIsShowTrailer(false)}
          ></div>

          <div className="MovieDetail__trailer-video">
            <VideoPlayer fileName={movie.trailerUrl} controls />
          </div>
        </div>
      )}
    </Flex>
  );
};
