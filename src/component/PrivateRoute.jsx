import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const PrivateRoute = ({ element: Element, children, ...rest }) => {
  const navigate = useNavigate();
  const isAuth = useAuth();

  useEffect(() => {
    if (isAuth !== null && !isAuth) {
      navigate('/', { replace: true });
    }
  }, [isAuth, navigate]);

  return isAuth && children;
};