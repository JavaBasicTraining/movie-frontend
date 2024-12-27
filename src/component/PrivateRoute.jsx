import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth !== null && !isAuth) {
      navigate('/', { replace: true });
    }
  }, [isAuth, navigate]);

  return isAuth && children;
};
