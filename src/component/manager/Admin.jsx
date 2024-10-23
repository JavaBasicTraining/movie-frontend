import { Outlet, useNavigate } from 'react-router-dom';

import { NavbarAdmin } from './NavbarAdmin';

import { useEffect, useState } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import useFetchUser from '../../hook/useFetchUser';
import useAuth from '../../hook/useAuth';

export const Admin = () => {
  const [showNavbar, setShowNavbar] = useState(false);
 const {token} = useAuth();
   const { user, isUser, fetchUser } = useFetchUser(token);
  const navigate = useNavigate(); // Thêm dòng này để sử dụng hàm navigate

  const onClickMenuNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser((userFetched) => {
        if (!userFetched && !userFetched.authorities.includes('admin')) {
          alert('Ba!!!');
          navigate('/admin');
        } 
      });
    };  
  }, []);

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
