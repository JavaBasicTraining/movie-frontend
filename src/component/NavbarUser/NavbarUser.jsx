/* eslint-disable no-lone-blocks */
import React, { useCallback, useEffect, useState } from 'react';
import { navbar } from '../../static-data/navBarusUser';
import './NavbarUser.scss';
import { NavItem } from './NavItem/NavItem';
import { faArrowRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { genreService, keycloakService } from '../../services';
import { useAuth } from '../../hooks';

export const NavbarUser = () => {
  const { isAuth } = useAuth();
  const [categories, setCategories] = useState([]);

  const insertCategories = useCallback(() => {
    navbar.forEach((item) => {
      if (item.name === 'Thể Loại') {
        item.subItems = categories.map((category) => ({
          name: category.name,
          path: category.name,
        }));
      }
    });
  }, [categories]);

  useEffect(() => {
    fetchCategories().then();
  }, []);

  useEffect(() => {
    insertCategories();
  }, [insertCategories]);

  const fetchCategories = async () => {
    const response = await genreService.getAll();
    setCategories(response.data);
  };

  const handleLogout = () => {
    keycloakService.openLogoutPage();
  };

  const handleLogin = () => {
    keycloakService.openLoginPage();
  };

  return (
    <nav className="NavbarUser">
      <div className="NavbarUser__top">
        <div className="f-title">MovieNight</div>
        <div className="NavbarUser_nav-list">
          {navbar?.map((item) => (
            <NavItem key={item.name} {...item} />
          ))}
        </div>
      </div>

      <div className="NavbarUser__bottom">
        <NavItem name="Settings" path="/#" icon={faGear} />
        {isAuth && (
          <NavItem
            name="Logout"
            icon={faArrowRightFromBracket}
            onItemClick={handleLogout}
          />
        )}

        {!isAuth && (
          <NavItem
            name="Login"
            icon={faArrowRightFromBracket}
            onItemClick={handleLogin}
          />
        )}
      </div>
    </nav>
  );
};
