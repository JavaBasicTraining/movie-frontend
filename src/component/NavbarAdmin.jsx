import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import './NavbarAdmin.scss';

export const NavbarAdmin = () => {
  const navbarList = [
    {
      name: 'Movie Management',
      link: '/admin/movie',
    },
    {
      name: 'User Management',
      link: '/admin/users',
    },
    {
      name: 'Category Management',
      link: '/admin/categories',
    },
  ];

  return (
    <div className="NavbarAdmin">
      <div className="d-flex justify-content-center align-items-center p-3">
        <img
          className="object-cover w-100 h-100"
          src="/poster/quay-phim-ch-p-nh-1696309932862999506271.png"
          alt="logo"
        />
      </div>

      <div className="d-flex flex-column gap-3 p-3">
        {navbarList.map((value, index) => (
          <Link to={value.link} key={index} className="NavbarAdmin__nav-item text-decoration-none">
            <Nav.Item className="text-white fs-5">{value.name}</Nav.Item>
          </Link>
        ))}
      </div>
    </div>
  );
};
