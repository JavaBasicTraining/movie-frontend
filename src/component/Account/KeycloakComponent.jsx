import React from 'react';
import "./KeycloakComponent.scss";

export const keycloak = {
  url: 'http://localhost:8080',
  realm: 'movie_website_realm',
  clientId: 'movie_website_client',
};

export const KeycloakComponent = () => {
  const handleKeycloakLogin = () => {
    const loginUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}&response_type=code&scope=openid`;
    window.open(loginUrl, '_self');
  };

  const handleKeycloakRegister = () => {
    const registerUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/registrations?client_id=${keycloak.clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}`;
    window.open(registerUrl, '_self');
  };

  // const handleFacebookLogin = () => {
  //   const facebookLoginUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}&response_type=code&scope=openid&kc_idp_hint=facebook`;
  //   window.open(facebookLoginUrl, '_self');
  // };

  //  const handleGoogleLogin = () => {
  //   const googleLoginUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}&response_type=code&scope=openid&kc_idp_hint=google`;
  //   window.open(googleLoginUrl, '_self');
  // };
  return (
    <div className='keycloak-container'>
      <button onClick={handleKeycloakLogin}>Đăng nhập</button>
      <button onClick={handleKeycloakRegister}>Đăng Ký</button>
      

    </div>
  );
};
