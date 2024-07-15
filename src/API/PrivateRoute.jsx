// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    element={isAuthenticated() ? <Component {...rest} /> : <Navigate to="/login" />}
  />
);

export default PrivateRoute;
