import { IMovie } from "../model/movie";
import { axiosInstance } from "./axiosConfig";

export const getMovie = (id: string) => {
  return axiosInstance.get<IMovie>(`/api/v1/movies/${id}`);
};

export const getMovies = () => {
  return axiosInstance.get<IMovie[]>("/api/v1/movies");
};
