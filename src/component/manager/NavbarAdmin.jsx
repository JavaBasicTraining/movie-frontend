import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import { RightOutlined } from "@ant-design/icons";
import { navbar } from "../../static-data/navBarAdmin";
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

  useEffect(() => {
    navbar.map((item) => {
        if (item.name === "Thể Loại") {
          item.subItems = categories.map((category) => ({
            name: category.name,
          }));
        }

      return item;
    });
  }, [categories]);
  const navbarList = [
    {
      name: "Movie Management",
      link: "/admin/movie",
    },
  ];

  const listItem = () => {
    return navbar.map((value) => {
      return (
        <div className="admin-nav-item">
          <span
            className="admin-nav-item-name"
            onClick={() => {
              if (value.name === "Thể Loại" || value.name === "Quốc Gia") {
                navigate("");
              } else {
                navigate(`/admin/movie/category/${value.name}`);
              }
            }}
          >
            {value.name === "Thể Loại" || value.name === "Quốc Gia" ? (
              <span className="item-icon">
                {value.name} <RightOutlined />
              </span>
            ) : (
              value.name
            )}
          </span>
          {value["subItems"] && (
            <div className="admin-nav-sub-items">
              {value["subItems"].map((sub, subIndex) => {
                return (
                  <span value={sub} className="admin-nav-item-name">
                    <Link
                      key={subIndex}
                      className="admin-link-item"
                      to={`/admin/movie/category/${sub.name}`}
                    >
                      {sub.name}
                    </Link>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="navbar-admin">
      <div className="logo">
      <img src="https://www.kindpng.com/picc/m/113-1133253_film-reel-bieu-tuong-xem-phim-hd-png.png"
       alt=""/>
      </div>
      <div>
        {navbarList.map((value, index) => (
          <Link key={index} to={value.link}>
            <button className="list-btn-admin text-nowrap">{value.name}</button>
          </Link>
        ))}
      </div>

      <div>
        <div className="navbar-admin-container">{listItem()}</div>
      </div>
    </div>
  );
};
