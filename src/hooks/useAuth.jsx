import { useEffect, useState } from 'react';
import { axiosInstance } from '../configs/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services';
import { ACCESS_TOKEN } from '../constants/storage';

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();
  const token = storageService.get(ACCESS_TOKEN);

  useEffect(() => {
    if (!token) {
      setIsAuth(false);
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const resourceAccess = decodedToken.resource_access || [];
        const clientAccess = resourceAccess.movie_website_client;
        const authorities = clientAccess.roles;
        if (authorities.includes('admin')) {
          axiosInstance
            .get('api/authenticate')
            .then(() => {
              setIsAuth(true);
            })
            .catch(() => {
              setIsAuth(false);
            });
        } else {
          setIsAuth(false);
          navigate(-2);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setIsAuth(false);
        navigate(-2);
      }
    }
  }, []);

  return { isAuth, token };
};

export default useAuth;
