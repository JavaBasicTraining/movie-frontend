import React, { useEffect, useState } from 'react';
import { HiOutlineFilm } from 'react-icons/hi';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { KeycloakComponent } from './account/KeycloakComponent';

export const HomePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const keycloak = {
    url: 'http://localhost:8080',
    realm: 'movie_realm',
    clientId: 'movie_website_client',
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem('access_token');
    return token !== null;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    const loginUrl = `http://localhost:8080/realms/${keycloak.realm}/protocol/openid-connect/logout?client_id=${keycloak.clientId}&post_logout_redirect_uri=http://localhost:3000`;
    window.open(loginUrl, '_self');
  };

  useEffect(() => {
    const tokenCleared = localStorage.getItem('tokenCleared');
    if (!tokenCleared) {
    }
  }, []);

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
              <label>Phim mới cập nhật chất lượng cao </label>
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
              href="/"
              onClick={(e) => {
                e.preventDefault(); 
                handleLogout(); 
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
