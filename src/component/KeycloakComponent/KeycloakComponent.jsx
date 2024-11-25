import React from 'react';
import './KeycloakComponent.scss';
import { keycloakService } from '../../services/keycloakService';

export const KeycloakComponent = () => {
  // const handleFacebookLogin = () => {
  //   const facebookLoginUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}&response_type=code&scope=openid&kc_idp_hint=facebook`;
  //   window.open(facebookLoginUrl, '_self');
  // };

  //  const handleGoogleLogin = () => {
  //   const googleLoginUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}&response_type=code&scope=openid&kc_idp_hint=google`;
  //   window.open(googleLoginUrl, '_self');
  // };
  return (
    <div className="keycloak-container">
      <button onClick={keycloakService.openLoginPage}>Đăng nhập</button>
      <button onClick={keycloakService.openRegisterPage}>Đăng Ký</button>
    </div>
  );
};
