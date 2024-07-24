import React, { useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";
import { useLoaderData, useNavigate } from "react-router-dom";
import { LikeOutlined, ShareAltOutlined } from "@ant-design/icons";

export async function filterMovieSeriesLoader({ params }) {
    const response = await axiosInstance.get(
      `/api/v1/movies/name/${params.name}`
    );
  
    return {
      movie: response.data,
    };
  }

export const MovieVideoSeries = () => {
  const [comment, setComment] = useState([]);
  const { movie } = useLoaderData();

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  const handleChange = (e) => {
    setComment(e.target.value);
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



  return (
    <div className="container">
      <div className="header-container">
        <div className="header">
          <video src={movie.videoUrl} controls />
        </div>
        <div className="btn-next-movie">
          <button>Tập Trước</button>
          <button>Tập Sau</button>
        </div>

        <div className="like-share">
          <button>
            <LikeOutlined />
          </button>
          <button>
            <ShareAltOutlined />
          </button>
        </div>
      </div>
      <div className="body">
        <div className="comment">
          <span>Bình Luận</span>
          <input
            className="input"
            type="text"
            value={comment}
            placeholder="Nhập bình luận của bạn..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          ></input>
        </div>
      </div>
    </div>
  );
};
