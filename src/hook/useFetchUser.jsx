import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../API/axiosConfig';

const useFetchUser = (token) => {
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('user: ', user);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token, location.pathname]);

  const fetchUser = async (onSuccess) => {
    try {
      const response = await axiosInstance.get('/api/account/info');
      onSuccess?.(response.data);
  
      setUser(response.data);
      setIsUser(true);
    } catch (error) {
      if (error?.response?.status === 401 && location.pathname !== '/login') {
        setIsUser(false);
        alert('Phiên bản hết hạn, vui lòng đăng nhập lại');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('id_token');
        navigate('/login');
      }
    }
  };

  return { user, isUser, fetchUser };
};

export default useFetchUser;
