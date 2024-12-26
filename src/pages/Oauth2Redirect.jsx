import React, { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import {
  ACCESS_TOKEN,
  ID_TOKEN,
  PREVIOUS_PATH,
  REFRESH_TOKEN,
} from '../constants/storage';
import { keycloakService } from '../services/keycloakService';
import { storageService } from '../services/storageService';

export async function Oauth2RedirectLoader({ request }) {
  const [, params] = request.url.split('?');
  const searchParams = new URLSearchParams(params);
  const code = searchParams.get('code');
  try {
    const response = await keycloakService.exchangeTokenByCode(code);

    if (response.data.access_token) {
      storageService.set(ACCESS_TOKEN, response.data.access_token);
      storageService.set(REFRESH_TOKEN, response.data.refresh_token);
      storageService.set(ID_TOKEN, response.data.id_token);
    }

    return {
      token: response.data.access_token,
    };
  } catch (error) {
    console.error(error);
    return {
      token: null,
    };
  }
}

export default function Oauth2Redirect() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaderData.token) {
      const path = storageService.get(PREVIOUS_PATH) ?? '/';
      navigate(path);
    } else {
      navigate('/login');
    }
  }, [loaderData.token, navigate]);

  return <div></div>;
}
