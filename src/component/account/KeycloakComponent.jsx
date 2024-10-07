import React, { useEffect } from 'react';
import axios from 'axios';
import "./KeycloakComponent.scss"

export const KeycloakComponent = () => {
  const keycloak = {
    url: 'http://localhost:8080',
    realm: 'movie_realm',
    clientId: 'movie_website_client',
    
  };
  

  const handleKeycloakLogin = () => {
  
      const loginUrl =  `http://localhost:8080/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}&response_type=code&scope=openid`;
      window.open(loginUrl, '_self');
      
  };
  const handleKeycloakRegistor = () =>
  {
    const registerUrl = `http://localhost:8080/realms/${keycloak.realm}/protocol/openid-connect/registrations?client_id=${keycloak.clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent('http://localhost:3000/redirect')}`;
    window.open(registerUrl, '_self');
  }
  return (
    <div className='keycloak-container'>
      <button onClick={handleKeycloakLogin}>Đăng nhập/</button>
      <button onClick={handleKeycloakRegistor}>Đăng Ký</button>
    </div>
  );
};
