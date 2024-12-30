import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../configs/axiosConfig';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useFetchUser from '../../hooks/useFetchUser';
import './MovieDetail.scss';
import { movieService } from '../../services';
import { Flex } from 'antd';

export async function MovieDetailLoader({ params }) {
  const response = await movieService.findByPath(params.path);
  return {
    movie: response.data,
  };
}

export const MovieDetail = () => {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { movie } = useLoaderData();
  const [isShowTrailer, setIsShowTrailer] = useState(false);
  const { user, fetchUser } = useFetchUser();
  const [jwt, setJwt] = useState(null);
  const [average, setAverage] = useState(0);
  const [countRating, setCountRating] = useState(0);

  const evaluationsNumberReview = async (params) => {
    const response = await axiosInstance.get(
      `/api/v1/evaluations/numberOfReviews/${params}`
    );
    setCountRating(response.data);
  };

  const handleKeyup = (e) => {
    if (e.code === 'Escape') {
      setIsShowTrailer(false);
    }
  };

  const averageRating = async (params) => {
    const response = await axiosInstance.get(
      `/api/v1/evaluations/average/${params}`
    );
    setAverage(response.data);
  };
  const handleClick = async (index) => {
    try {
      setRating(index);
      evaluationsNumberReview(movie.id);
      if (jwt) {
        const response = await axiosInstance.get(
          `/api/v1/evaluations/user/${user.id}/movie/${movie.id}`
        );
        if (response.status === 200 && response.data !== '') {
          const request = {
            star: index,
            userId: user.id,
            movieId: movie.id,
          };
          await axiosInstance.put(
            `/api/v1/evaluations/${response.data.id}`,
            request
          );
          if (index === null) {
            return 0;
          } else {
            setAverage(index);
          }
        } else {
          const request = {
            star: index,
            userId: user.id,
            movieId: movie.id,
          };
          await axiosInstance.post(`/api/v1/evaluations`, request);
          if (index === null) {
            return 0;
          } else {
            setAverage(index);
          }
        }
      } else {
        alert(`Bạn phải đăng nhập!!`);
        navigate(`/login`);
      }
    } catch (error) {
      alert('Lỗi' + error);
    }
  };

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

  const handleWatchTrailer = () => {
    setIsShowTrailer(true);
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

      <Flex className="MovieDetail__content" gap={10}>
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
              <span className="f-medium">{movie?.description}</span>
            </Flex>
          </>
        </Flex>
        <Flex className="MovieDetail__rating-and-cast">
          <div className="MovieDetail__rating"></div>
          <div className="MovieDetail__cast"></div>
        </Flex>
      </Flex>

      <Flex className="MovieDetail__actions" justify="center" gap={10}>
        <button className="btn">Watch Together</button>
        <button className="btn btn-primary">Watch Only</button>
        <button className="btn" onClick={handleWatchTrailer}>
          Watch Trailer
        </button>
      </Flex>

      {isShowTrailer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            onClick={() => setIsShowTrailer(false)}
          ></div>

          <video
            src={movie.trailerPresignedUrl}
            controls
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
            }}
          ></video>
        </div>
      )}
    </Flex>
  );
};
