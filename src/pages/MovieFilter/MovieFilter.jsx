import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './MovieFilter.scss';
import { MovieCard } from '../../component';
import { movieService } from '../../services';

export async function MovieFilterLoader({ params, request }) {
  const searchParams = new URL(request.url).searchParams;
  const response = await movieService.query({
    keyword: searchParams.get('keyword'),
    genre: params.genre,
    county: params.county,
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
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};
