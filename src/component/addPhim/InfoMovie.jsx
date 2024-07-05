import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";
import { useLoaderData } from "react-router-dom";

export async function filterMovieLoader({ params }) {
  const response = await axiosInstance.get(
    `/api/v1/movies/filter/${params.nameMovie}`
  );
  //    {
  //   params: params.nameMovie,
  // });
  return {
    movie: response.data,
  };
}

export const InfoMovie = () => {
  const { movie} = useLoaderData();

  return (
    <div>
      <span>Welcome to TrumPhim.Net</span>
      <div className="video-item">
        
        <video src={movie.videoUrl} controls />
      </div>
    </div>
  );
};
