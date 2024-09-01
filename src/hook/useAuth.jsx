import { useEffect, useState } from 'react';
import { axiosInstance } from '../API/axiosConfig';

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuth(false);
    } else {
      axiosInstance
        .get('api/authenticate')
        .then(() => {
          setIsAuth(true);
        })
        .catch(() => {
          setIsAuth(false);
        });
    }
  }, []);

  return isAuth;
};

export default useAuth;
