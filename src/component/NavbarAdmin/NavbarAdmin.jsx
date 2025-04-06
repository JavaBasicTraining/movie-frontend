import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarAdmin.scss';
import { UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

export const NavbarAdmin = () => {
  const navMenu = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/admin/movie">Movie Management</Link>,
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: <Link to="/admin/movie">User Management</Link>,
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: <Link to="/admin/movie">Category Management</Link>,
    },
  ];

  return (
    <div className="NavbarAdmin">
      <div className="NavbarAdmin__logo">
        <img src="/images/final.gif" alt="logo admin" />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={navMenu}
      />
    </div>
  );
};
