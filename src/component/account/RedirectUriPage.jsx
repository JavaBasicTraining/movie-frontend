import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useFetchUser from '../../hook/useFetchUser';
import { useNavigate } from 'react-router-dom';
import { keycloak } from './KeycloakComponent';

export const RedirectUriPage = () => {
  const [token, setToken] = useState();
  const { user, isUser, fetchUser } = useFetchUser(token);
  const navigate = useNavigate();

  const getToken = async (code) => {
    console.log(code);
    const data = {
      grant_type: 'authorization_code',
      code: code,
      client_id: keycloak.clientId,
      redirect_uri: 'http://localhost:3000/redirect',
    };
  
    try {
      const response = await axios.post(
        `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/token`,
        new URLSearchParams(data),
        {
          headers: {  
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      if (response.data.access_token) {
        console.log('Access Token:', response.data.access_token);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('id_token', response.data.id_token);
        setToken(response.data.access_token);
  
        await fetchUser();
  
        await fetchUser((userFetched) => {
          if (userFetched && userFetched.authorities.includes('admin')) {
            alert('Đăng Nhập Tài Khoản Admin Thành Công!!!');
            navigate('/admin');
          } else {
            alert('Đăng Nhập Tài Khoản Thành Công!!!');
            navigate('/');
          }
        });
      }
    } catch (error) {
      console.error('Error fetching token:', error.message);
    }
  };
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      getToken(code);
    }
  }, []); 

  return <div></div>;
};
