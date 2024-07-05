import React, { useEffect, useState } from "react";
import navbarJson from "../config/navbar-config.json";
import { Link } from "react-router-dom";
import { axiosInstance } from "../API/axiosConfig";

export const Navbar = () => {
  const [data, setData] = useState([]);
  const fetchNavbar = async () => {
    const response = await axiosInstance.get(`/api/v1/navbar/getList`);
    setData(response.data);
  };

  useEffect(() => {
    fetchNavbar();
  }, []);
  return (
    <div className="navbar">
      {data.map((item) => (
        <Link to = {`movie/${item.name}`}>
          <button className="list-btn">{item.name}</button>
        </Link>
      ))}
    </div>
  );
};
