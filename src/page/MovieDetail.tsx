import React from 'react';
import { getMovie } from "../API/movieAPI";
import { useLoaderData } from "react-router-dom";
import { IMovie } from "../model/movie";

export async function MovieDetailLoader({ params }: any) {
  try {
    const movie = await getMovie(params.id);
    return { movie };
  } catch (error) {
    return {
      movie: { id: "1", name: "Movie 1" }
    };
  }
}

const MovieDetail = () => {
  const { movie } = useLoaderData() as { movie: IMovie };
  return (
    <div>
      {movie.id} {movie.name}
    </div>
  );
};

export default MovieDetail;
