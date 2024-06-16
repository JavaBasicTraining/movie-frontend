import React from 'react';
import { getMovies } from "../API/movieAPI";
import { Link, useLoaderData } from "react-router-dom";
import { IMovie } from "../model/movie";

export async function HomeLoader() {
  try {
    const movies = await getMovies();
    return { movies };
  } catch (error) {
    return {
      movies: Array(10).fill('').map((value, index) => ({
        id: index,
        name: `Movie ${index}`,
      }))
    };
  }
}

const Home = () => {
  const { movies } = useLoaderData() as { movies: IMovie[] };
  return (
    <div>
      {movies.map((movie: IMovie) => (<Link to={`/movie/${movie.id}`}>{movie.name}</Link>))}
    </div>
  );
};

export default Home;
