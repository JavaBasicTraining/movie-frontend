import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";
import { useLoaderData, useNavigate } from "react-router-dom";
import { LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

export async function filterMovieLoader({ params }) {
  const response = await axiosInstance.get(
    `/api/v1/movies/name/${params.name}`
  );

  return {
    movie: response.data,
  };
}

export const MovieVideo = () => {
  const [comment, setComment] = useState("");
  const { movie } = useLoaderData();
  const [user, setUser] = useState([]);
  const [jwt, setJwt] = useState(null);

  const fetchUser = async (userName) => {
    try {
      const response = await axiosInstance.get(`/api/account/getUser`, {
        params: { userName },
      });
      setUser(response.data ?? []);
      console.log(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setJwt(decodedToken);
      fetchUser(decodedToken.sub);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComment({
      ...comment,
      [name]: value,
    });
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (jwt) {
        const request = new FormData();
        request.append("content", comment.content);
        request.append("idUser", user.id);
        request.append("idMovies", movie.id);

        try {
          const response = await axiosInstance.post(
            `/api/v1/comment/create`,
            request
          );
          alert("Comment Thành Công!!!");
        } catch (error) {
          console.error("Error posting comment:", error);
          alert("Có lỗi xảy ra khi đăng bình luận.");
        }
      } else {
        alert("Bạn phải đăng nhập");
      }
    }
  };

  return (
    <div className="container">
      <div className="header-container">
        <div className="header">
          <video src={movie.videoUrl} controls />
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
            name="content"
            value={comment.content || ""}
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