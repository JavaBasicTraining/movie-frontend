import React from 'react';
import { axiosInstance } from '../../configs/axiosConfig';
import { Link, useLoaderData } from 'react-router-dom';
import './ListMovieUser.scss';

export async function MovieLoader({ params }) {
  const response = await axiosInstance.get(`/api/v1/movies`, {
    params: params.path,
  });
  return {
    movies: response.data ?? [],
  };
}

export async function CountryLoader({ params }) {
  const response = await axiosInstance.get(`/api/v1/movies`, {
    params: params.path,
  });
  return {
    movies: response.data ?? [],
  };
}

export const Movie = () => {
  const { movies } = useLoaderData();

  return (
    <div className="container">
      {
        <div className="item">
          {movies?.map((item) => (
            <Link to={`/${item.path}`}>
              <div className="poster" key={item.id}>
                <div className="img-item-filter">
                  <img src={item.posterUrl} alt="" />
                </div>
                <div className="title-movie">
                  <span>{item.nameMovie}</span>
                  <span>{item.enTitle}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      }
    </div>
  );
};
