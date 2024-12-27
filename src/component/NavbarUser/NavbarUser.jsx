/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navbar } from '../../static-data/navBarusUser';
import './NavbarUser.scss';
import { NavItem } from './NavItem/NavItem';
import { faArrowRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { genreService, keycloakService } from '../../services';
import { useAuth } from '../../hooks';

export const NavbarUser = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then();
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
    const response = await genreService.getAll();
    setCategories(response.data);
  };

  const listItem = () => {
    return navbar.map((value, index) => {
      return (
        <div key={index} className="nav-item">
          <span
            className="nav-item-name"
            onClick={() => {
              if (value.path !== undefined) {
                navigate(`/${value.path}`);
              }
            }}
          >
            {value.name}
          </span>
          {value['subItems'] && (
            <div className="nav-sub-items">
              {value['subItems'].map((sub, subIndex) => {
                return (
                  <span value={sub} className="nav-item-name">
                    <Link
                      key={subIndex}
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
