import React from 'react';
import { Link } from 'react-router-dom';

export const NavbarAdmin = () => {
  const navbarList = [
    {
      name: 'Movie Management',
      link: '/Admin/movie',
    },
    {
      name: 'User Management',
      link: '/Admin/movie',
    },
    {
      name: 'Category Management',
      link: '/Admin/movie',
    },
  ];

  return (
    <div className="navbar-admin">
      <div className="logo">
        <img
          src="/poster/quay-phim-ch-p-nh-1696309932862999506271.png"
          alt=""
        />
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
