import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { keycloakService } from '../services';

export const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth !== null && !isAuth) {
      keycloakService.openLoginPage();
    }
  }, [isAuth, navigate]);

  return isAuth && children;
};
