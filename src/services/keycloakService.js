import axios from 'axios';
import { storageService } from './storageService';
import { REDIRECT_URL } from '../constants/keycloak';
import { keycloak } from '../configs/keycloak';
import { ACCESS_TOKEN } from '../constants/storage';

class KeycloakService {
  exchangeTokenByCode(code) {
    const data = {
      grant_type: 'authorization_code',
      code: code,
      client_id: keycloak.clientId,
      redirect_uri: REDIRECT_URL,
    };

    return axios.post(
      `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }

  openLoginPage() {
    const loginUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&response_type=code&scope=openid`;
    window.open(loginUrl, '_self');
  }

  openRegisterPage = () => {
    const registerUrl = `${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/registrations?client_id=${keycloak.clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(REDIRECT_URL)}`;
    window.open(registerUrl, '_self');
  };

  openLogoutPage() {
    storageService.remove(ACCESS_TOKEN);
    const loginUrl = `http://localhost:8080/realms/${keycloak.realm}/protocol/openid-connect/logout?client_id=${keycloak.clientId}&post_logout_redirect_uri=http://localhost:3000`;
    window.open(loginUrl, '_self');
  }
}

export const keycloakService = new KeycloakService();
