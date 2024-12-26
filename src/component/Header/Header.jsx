import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { HiOutlineFilm } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { keycloakService } from '../../services';
import { KeycloakComponent } from '../KeycloakComponent/KeycloakComponent';
import './Header.scss';

export const Header = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const { token } = useAuth();

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const isLoggedIn = () => {
    return token !== null;
  };

  const filterMovie = async (event, params) => {
    try {
      if (event && event.key === 'Enter') {
        event.preventDefault();
      }
      if (params === '') {
        navigate('/');
      } else if (event.target) {
        navigate(`/filter/${params}`);
      }
    } catch (error) {
      navigate(`/filter/${params}`);
      return null;
    }
  };

  return (
    <div className="home-page">
      <div className="header">
        <div className="header-title">
          <div className="header-title-icon">
            <HiOutlineFilm className="icon"></HiOutlineFilm>
            <div className="title">
              <span>TrumPhim.Net </span>
              <span>Phim mới cập nhật chất lượng cao </span>
            </div>
          </div>
          <div className="search">
            <input
              placeholder="Tim Kiếm Phim"
              className="search-input"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  filterMovie(event, name);
                }
              }}
              required
            ></input>
            <button onClick={() => filterMovie(null, name)}>
              <SearchOutlined />
            </button>
          </div>
        </div>
        
        {!isLoggedIn() && (
          <div className="login-register">
            <KeycloakComponent className="keycloak" />
          </div>
        )}

        {isLoggedIn() && (
          <div className="login-register">
            <a
              href="/public"
              onClick={(e) => {
                e.preventDefault();
                keycloakService.openLogoutPage();
              }}
            >
              Đăng Xuất
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
