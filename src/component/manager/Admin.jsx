import { Outlet } from 'react-router-dom';

import { NavbarAdmin } from './NavbarAdmin';

import { useState } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';

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
          <button onClick={onClickMenuNavbar} className="h-fit">
            <UnorderedListOutlined />
          </button>

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
  );
};
