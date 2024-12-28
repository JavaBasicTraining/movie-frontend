import React from 'react';
import { axiosInstance } from '../../configs/axiosConfig';
import { useLoaderData } from 'react-router-dom';
import './MovieFilter.scss';
import { MovieCard } from '../../component';

export async function MovieFilterLoader({ params }) {
  const response = await axiosInstance.get(`/api/v1/movies`, {
    params: {
      keyword: params.keyword,
      genre: params.genre,
      county: params.county,
    },
  });
  return {
    movies: response.data ?? [],
  };
}

export const MovieFilter = () => {
  const { movies } = useLoaderData();

  return (
    <div className="MovieFilter">
      <>
        {movies && (
          <div className="MovieFilter__grid-movies">
            {movies?.map((item) => (
              <MovieCard movie={item} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};
