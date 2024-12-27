import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { accountService } from '../services';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    return new Promise((resolve, reject) => {
      accountService
        .getUser()
        .then((response) => {
          setUser(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Fetch user error: ', error);
          reject(new Error(error));
        });
    });
  };

  useEffect(() => {
    fetchUser()
      .then((user) => {
        if (user) {
          setIsAuth(true);
          setUser(user);
        } else {
          setIsAuth(false);
          setUser(null);
        }
      })
      .catch(() => {
        setIsAuth(false);
        setUser(null);
      });
  }, []);

  const value = useMemo(() => ({ isAuth, user }), [isAuth, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
