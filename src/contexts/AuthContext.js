import { createContext, useEffect, useState } from 'react';
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
          reject(error);
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

  return (
    <AuthContext.Provider value={{ isAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
};
