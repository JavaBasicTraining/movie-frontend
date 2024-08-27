import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
export const NavbarAdmin = () => {

  
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const fetchGenre = async () => {
    const response = await axiosInstance.get(`/api/v1/genre`);
    setCategories(response.data);
  };

  useEffect(() => {
    fetchGenre();
  }, []);


  const navbarList = [
    {
      name: "Movie Management",
      link: "/admin/movie",
    },
    {
      name: "User Management",
      link: "/admin/movie",
    },
    {
      name: "Category Management",
      link: "/admin/movie",
    },
  ];

  return (
    <div className="navbar-admin">
      <div className="logo">
      <img src="/poster/quay-phim-ch-p-nh-1696309932862999506271.png"
       alt=""/>
      </div>
      <div className="item-navbar-admin">
        {navbarList.map((value, index) => (
          <Link key={index} to={value.link}>
            <button className="list-btn-admin text-nowrap">{value.name}</button>
          </Link>
        ))}
      </div>
    </div>
  );
};
