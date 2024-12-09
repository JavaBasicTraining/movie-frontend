import { useUser } from '../contexts/UserContext';
import { keycloakService } from '../services';
import PropTypes from 'prop-types';

export const PrivatePage = ({ children }) => {
  const { user, loading } = useUser();
  // Đợi cho đến khi user information được load xong
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu chưa đăng nhập, redirect tới trang login
  if (!user) {
    keycloakService.openLoginPage();
    return null;
  }

  // Nếu đã đăng nhập, render children
  return children;
};

PrivatePage.propTypes = {
  children: PropTypes.node.isRequired,
};
