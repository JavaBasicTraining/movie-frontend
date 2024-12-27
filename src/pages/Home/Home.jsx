import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../configs/axiosConfig';
import './Home.scss';

export const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      }
    };

    fetchMovies();
  }, []);

  const horrifiedMovies = movies.filter((movie) =>
    movie.genres.some((genreName) =>
      genreName.name.toLowerCase().includes('kinh dị'.toLowerCase())
    )
  );
  const adventureMovies = movies.filter((movie) =>
    movie.genres.some((genreName) =>
      genreName.name.toLowerCase().includes('phiêu lưu'.toLowerCase())
    )
  );
  const cartoonMovies = movies.filter((movie) =>
    movie.genres.some((genreName) =>
      genreName.name.toLowerCase().includes('hoạt hình'.toLowerCase())
    )
  );

  return <div className="home"></div>;
};
