import React, { useEffect } from 'react';
import useFetchUser from '../../hooks/useFetchUser';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { keycloakService } from '../../API/keycloakService';

export async function Oauth2RedirectLoader({ request }) {
  const [, params] = request.url.split('?');
  const searchParams = new URLSearchParams(params);
  const code = searchParams.get('code');
  try {
    const response = await keycloakService.exchangeTokenByCode(code);

    if (response.data.access_token) {
      console.log('Access Token:', response.data.access_token);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('id_token', response.data.id_token);
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
  const { fetchUser } = useFetchUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (loaderData.token) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [loaderData.token]);

  return <div></div>;
}