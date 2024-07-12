import React, { useState } from "react";
import { HiOutlineFilm } from "react-icons/hi";
import { SearchOutlined } from "@ant-design/icons";
import { axiosInstance } from "../API/axiosConfig";
import {  useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const handleChange = (e) => {
    setName(e.target.value);
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
   
  };

  const filterMovie = async (params) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/movies/filter/${params}`
      );
      console.log(response.data);
      alert("Tìm kiếm thành công");
    } catch (error) {
      alert(`Lỗi khi tìm kiếm phim: ${error.message}`);
    }
  };

  return (
    <div className="home-page">
      <div className="header">
        <div className="header-title">
          <div className="header-title-icon">
            <HiOutlineFilm className="icon"></HiOutlineFilm>
            <div className="title">
              <span>TrumPhim.Net </span>
              <label>Phim mới cập nhật chất lượng cao </label>
            </div>
          </div>
          <div className="search">
            <input
              placeholder="Tim Kiếm Phim"
              className="search-input"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              required
            ></input>
            <button onClick={() => filterMovie(name)}>
         
              <SearchOutlined />
            </button>
          </div>
        </div>
        {!isLoggedIn() && (
          <div className="login-register">
            <a href="/login">Đăng Nhập/ </a>
            <a href="/register">Đăng Ký</a>
          </div>
        )}
        {isLoggedIn() && (
          <div className="login-register" >
          
              <a href="/" onClick={handleLogout}>Đăng Xuất</a>
          
          </div>
        )}
      </div>
    </div>
  );
};
