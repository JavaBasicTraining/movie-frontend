import { useEffect, useState } from 'react';
import { axiosInstance } from '../API/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      setIsAuth(false);
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const resourceAccess = decodedToken.resource_access || [];
        const clientAccess = resourceAccess.movie_website_client;
        const authorities = clientAccess.roles
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
          navigate(`/`);
          
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuth(false);
      }
    }
  }, []);

  return {isAuth , token};
};

export default useAuth;
