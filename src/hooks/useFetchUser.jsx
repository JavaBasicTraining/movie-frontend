import { useEffect, useState } from 'react';
import { accountService } from '../services';

const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(true);

  const fetchUser = async (onSuccess) => {
    try {
      const response = await accountService.getUser();
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
