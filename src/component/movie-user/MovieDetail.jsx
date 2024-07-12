import React, { useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";
import { useLoaderData, useNavigate } from "react-router-dom";

export async function posterMovieLoader({ params }) {
  const response = await axiosInstance.get(
    `/api/v1/movies/name/${params.name}`
  );

  return {
    movie: response.data,
  };
}

export const MovieDetail = () => {
  const navigate = useNavigate();
  const { movie } = useLoaderData();

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  const handleChange = (e) => {
    return e.target.value;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isLoggedIn()) {
        alert("Comment Thành Công!!!");
      } else {
        alert(`Bạn phải đăng nhập`);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      alert("Comment Thành Công!!!");
    } else {
      alert(`Bạn phải đăng nhập`);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="content">
          <div className="btn-poster">
            <img className="poster" src={movie.posterUrl} alt="" />
            <div className="list-btn">
              {movie.category.name === "Phim lẻ" ? (
                <button
                  onClick={() => navigate(`/xem-phim/${movie.nameMovie}`)}
                >
                  Xem Phim
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/xem-phim-bo/${movie.nameMovie}`)}
                >
                  Xem Phim
                </button>
              )}
              <button>Xem Trailer</button>
            </div>
          </div>
          <div className="info">
            <span> {movie.nameMovie} </span>
            <span>Đánh Giá: </span>
            <span>Quốc Gia: {movie.country}</span>
            <span>Năm Phát Hành: {movie.year} </span>
            <span>
              Thể Loại:{" "}
              {movie.genres.map((category) => category.name).join(" , ")}
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
  );
};
