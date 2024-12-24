import { Outlet, useNavigate } from 'react-router-dom';

import './Admin.scss';

import { useEffect, useState } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import { NavbarAdmin } from '../../component/NavbarAdmin/NavbarAdmin';
import PrivateRoute from '../../component/PrivateRoute';
import { Button } from 'antd';

export const Admin = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const navigate = useNavigate();

  const onClickMenuNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  useEffect(() => {
    const pathname = window.location.pathname.replace(/\//g, '');
    if (pathname === 'admin') {
      navigate('/admin/movie');
    }
  }, [navigate]);

  return (
    <PrivateRoute>
      <div className="admin-container">
        <div className={`menu-navbar ${showNavbar ? 'navbar-show' : ''}`}>
          <NavbarAdmin />
        </div>

        <div className="right-container">
          <div className="header">
            <Button onClick={onClickMenuNavbar} className="h-fit">
              <UnorderedListOutlined />
            </Button>

            <div className="body-item">
              <div className="title">
                <h1>Welcome to Admin TrumPhim.Net</h1>
              </div>
            </div>
          </div>
          <div className="body">
            <Outlet />
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};
