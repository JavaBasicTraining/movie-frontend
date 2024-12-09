import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { accountService } from '../services';
import PropTypes from 'prop-types';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const value = useMemo(
    () => ({ user, loading, setUser }),
    [user, loading]
  );

  useEffect(() => {
    accountService.getUserInfo()
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch user:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
