import axios from 'axios';
import { keycloak } from '../component/Account/KeycloakComponent';

class KeycloakService {
  exchangeTokenByCode(code) {
    const data = {
      grant_type: 'authorization_code',
      code: code,
      client_id: keycloak.clientId,
      redirect_uri: 'http://localhost:3000/redirect',
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
}

export const keycloakService = new KeycloakService();
