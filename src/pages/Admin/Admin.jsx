import { Navigate, Outlet } from 'react-router-dom';

import { NavbarAdmin } from '../../component/NavbarAdmin';

import { useState } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Button } from 'react-bootstrap';

export const Admin = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const onClickMenuNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
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
          <Navigate to="/admin/movie" />
        </div>
      </div>
    </div>
  );
};
