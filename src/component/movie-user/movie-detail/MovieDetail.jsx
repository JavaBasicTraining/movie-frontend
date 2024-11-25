import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../API/axiosConfig';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { StarFilled, StarOutlined, StarTwoTone } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import useFetchUser from '../../../hooks/useFetchUser';
import "./MovieDetail.scss"
export async function posterMovieLoader({ params }) {
  const response = await axiosInstance.get(`/api/v1/movies/${params.id}`);

  return {
    movie: response.data,
  };
}

export const MovieDetail = () => {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { movie } = useLoaderData();
  const [isShowTrailer, setIsShowTrailer] = useState(false);
  const { user, isUser, fetchUser } = useFetchUser();
  const [jwt, setJwt] = useState(null);
  const [average, setAverage] = useState(0);
  const [countRating, setCountRating] = useState(0);
  const evaluationsNumberReview = async (params) => {
    const response = await axiosInstance.get(
      `/api/v1/evaluations/numberOfReviews/${params}`
    );
    setCountRating(response.data);
  };
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setJwt(decodedToken);
      fetchUser();
    }
    window.addEventListener('keyup', handleKeyup);
    return () => {
      window.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  useEffect(() => {
    averageRating(movie.id);
    evaluationsNumberReview(movie.id);
  }, [average, rating]);

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

  return (
    <div style={{ position: 'relative' }}>
      <div className="container">
        <div className="header">
          <div className="content">
            <div className="btn-poster">
              <img className="poster" src={movie.posterUrl} alt="" />
              <div className="list-btn">
                {movie.category.id === 1 ? (
                  <button onClick={() => navigate(`/xem-phim/${movie.id}`)}>
                    Xem Phim
                  </button>
                ) : (
                  <button onClick={() => navigate(`/xem-phim/${movie.id}`)}>
                    Xem Phim
                  </button>
                )}
                <button onClick={() => setIsShowTrailer(true)}>
                  Xem Trailer
                </button>
              </div>
            </div>
            <div className="info">
              <span> {movie.nameMovie} </span>
              <div>
                <span>Đánh Giá: </span>
                {[...Array(5)].map((_, i) => {
                  const index = i + 1;
                  const StarComponent =
                    index <= rating ? StarFilled : StarOutlined;
                  return (
                    <StarComponent
                      onClick={() => {
                        handleClick(index);
                      }}
                      style={index <= rating ? { color: '#fadb14' } : {}}
                      key={index}
                    />
                  );
                })}
                ({average}/ {countRating} lượt)
              </div>

              <span>Quốc Gia: {movie.country}</span>
              <span>Năm Phát Hành: {movie.year} </span>
              <span>
                Thể Loại:{' '}
                {movie.genres.map((category) => category.name).join(', ')}
              </span>
            </div>
          </div>
          <div className="body">
            <h1>Nội dung:</h1>
            <span> {movie.description}</span>
          </div>
          <div className="body">
            <span> Có Thể Bạn Muốn Xem</span>
          </div>
        </div>
      </div>
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
            src={movie.videoUrl}
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
    </div>
  );
};
