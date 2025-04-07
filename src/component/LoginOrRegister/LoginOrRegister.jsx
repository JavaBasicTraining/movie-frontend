import React from 'react';
import './LoginOrRegister.scss';
import { keycloakService } from '../../services';

export const LoginOrRegister = () => {
  return (
    <div className="login-or-register">
      <button onClick={keycloakService.openLoginPage}>Đăng nhập</button>
      <button onClick={keycloakService.openRegisterPage}>Đăng Ký</button>
    </div>
  );
};
