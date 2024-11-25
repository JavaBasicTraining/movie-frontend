import { useEffect, useState } from 'react';
import { axiosInstance } from '../API/axiosConfig';

const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(true);

  const fetchUser = async (onSuccess) => {
    try {
      const response = await axiosInstance.get('/api/account/info');
      onSuccess?.(response.data);
      setUser(response.data);
      setIsUser(true);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser().then();
  }, []);

  return { user, isUser, fetchUser };
};

export default useFetchUser;
