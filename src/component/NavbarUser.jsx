/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../API/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { navbar } from '../static-data/navBarusUser';

export const NavbarUser = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    navbar.map((item) => {
      if (item.name === 'Thể Loại') {
        item.subItems = categories.map((category) => ({
          name: category.name,
          path: category.name,
        }));
      }
      return item;
    });
  }, [categories]);

  const fetchCategories = async () => {
    const response = await axiosInstance.get(`/api/v1/genre`);
    setCategories(response.data);
  };

  const listItem = () => {
    return navbar.map((value) => {
      return (
        <div key={value} className="nav-item">
          <button
            className="nav-item-name"
            onClick={() => {
              if (value.path !== undefined) {
                navigate(`/${value.path}`);
              }
            }}
          >
            {value.name}
          </button>
          {value['subItems'] && (
            <div className="nav-sub-items">
              {value['subItems'].map((sub, subIndex) => {
                return (
                  <span key={sub.name} className="nav-item-name">
                    <Link
                      className="link-item"
                      to={(value.basePath ?? '') + `/${sub.name}`}
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
    <div>
      <div className="navbar">{listItem()}</div>
    </div>
  );
};
