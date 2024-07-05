import React, { useEffect, useState } from "react";
import { axiosInstance } from "../API/axiosConfig";
import { Link } from "react-router-dom";
export const Movie = () => {
  const [listMovie, setListMovie] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/movies/get_list`);
      setListMovie(response.data);
    } catch (error) {
      alert("Lỗi: " + error);
    }
  };

  return (
    <div className="container">
      {
        <div className="item">
          {listMovie.map((item) => (
            <Link to = {`/movie/info/${item.nameMovie}`}>
              <div className="poster" key={item.id}>
              <img src={item.posterUrl} alt="" />
              <div className="title-movie">
                <a href={`/movie/info/${item.nameMovie}`}>{item.viTitle}</a>
                <a href={`/movie/info/${item.nameMovie}`}>{item.enTitle}</a>
              </div>
            </div>
            </Link>
          ))}
        </div>
      }
    </div>
  );
};
