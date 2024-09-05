import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";
import { useLoaderData } from "react-router-dom";
import { LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

export async function filterMovieLoader({ params }) {
  const response = await axiosInstance.get(`/api/v1/movies/name/${params.name}`);
  return { movie: response.data };
}

export const MovieVideo = () => {
  const [comment, setComment] = useState("");
  const [listComment, setListComment] = useState([]);
  const { movie } = useLoaderData();
  const [user, setUser] = useState({});
  const [jwt, setJwt] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const fetchUser = async (userName) => {
    try {
      const response = await axiosInstance.get(`/api/account/getUser`, { params: { userName } });
      setUser(response.data ?? {});
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
      fetchComment();
      setShowComment(true);
    }
  }, []);

  const fetchComment = async () => {
    try {
      const params = new URLSearchParams({ movieId: movie.id });
      const response = await axiosInstance.get("/api/v1/comment", { params });
      setListComment(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleKeyDownUpdateComment = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdateComment();
    }
  };

  const handleUpdateComment = async () => {
    if (editCommentId && editCommentContent) {
      try {
        const request = {
          content: editCommentContent,
          idUser: user.id,
          user: user.userName,
          idMovie: movie.id,
        };
        await axiosInstance.put(`/api/v1/comment/update`, request, {
          params: { commentId: editCommentId },
        });
        fetchComment();
        setEditCommentId(null);
        setEditCommentContent("");
      } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật bình luận:", error);
      }
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/api/v1/comment/delete/${commentId}`);
      alert("Xóa Thành Công!!");
      fetchComment();
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa bình luận:", error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (jwt) {
        const request = new FormData();
        request.append("content", comment);
        request.append("idUser", user.id);
        request.append("idMovie", movie.id);
        request.append("user", user.userName);

        try {
          await axiosInstance.post(`/api/v1/comment/create`, request);
          fetchComment();
          setComment(""); // Clear comment input after posting
        } catch (error) {
          console.error("Error posting comment:", error);
          alert("Có lỗi xảy ra khi đăng bình luận.");
        }
      } else {
        alert("Bạn phải đăng nhập");
      }
    }
  };

  const handleEditClick = (commentId, content) => {
    setEditCommentId(commentId);
    setEditCommentContent(content);
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
          {showComment &&
            listComment.map((value) => (
              <div className="show-comment" key={value.id}>
                <h1>@{value.user}: </h1>
                {editCommentId === value.id ? (
                  <div className="edit-comment">
                    <input
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      onKeyDown={handleKeyDownUpdateComment}
                    />
                    <div>
                      <button onClick={handleUpdateComment}>Lưu</button>
                      <button onClick={() => setEditCommentId(null)}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <div className="edit-comment">
                    <label>{value.content}</label>
                    <div className="choose-update-delete">
                      <button onClick={() => handleEditClick(value.id, value.content)}>Chỉnh Sửa</button>
                      <button onClick={() => handleDelete(value.id)}>Xóa</button> 
                    </div>
                  </div>
                )}
              </div>
            ))}
          <span>Bình Luận</span>
          <input
            className="input"
            type="text"
            value={comment}
            placeholder="Nhập bình luận của bạn..."
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            required
          />
        </div>
      </div>
    </div>
  );
};
