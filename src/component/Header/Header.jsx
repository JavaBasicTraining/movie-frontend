import React, { useLayoutEffect, useState } from 'react';
import { HiOutlineFilm } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import { keycloakService } from '../../services';
import { LoginOrRegister } from '../LoginOrRegister/LoginOrRegister';
import './Header.scss';
import { Navbar } from './Navbar/Navbar';
import { SearchBar } from './SearchBar/SearchBar';

export const Header = () => {
  const { token } = useAuth();
  const [showBackground, setShowBackground] = useState(false);

  const isLoggedIn = () => {
    return token !== null;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    keycloakService.openLogoutPage();
  };

  const onScroll = () => {
    console.log("scroll y", window.scrollY);
    setShowBackground(window.scrollY > 30)
  };

  useLayoutEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  });

  return (
    <div className={`Header ${showBackground && 'Header--none-opacity'}`}>
      <div className="Header__left">
        <HiOutlineFilm className="Header__logo"></HiOutlineFilm>
        <Navbar />
      </div>

      <div className="Header__right">
        <SearchBar />

        {!isLoggedIn() && (
          <div className="login-register">
            <LoginOrRegister className="keycloak" />
          </div>
        )}

        {isLoggedIn() && (
          <div className="login-register">
            <a href="/public" onClick={handleLogout}>
              Đăng Xuất
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
