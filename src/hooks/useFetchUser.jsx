import { useEffect, useState, useCallback } from 'react';
import { accountService } from '../services';

const useFetchUser = () => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async (onSuccess) => {
    try {
      const response = await accountService.getUserInfo();
      onSuccess?.(response.data);
      setUser(response.data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!user) {
      fetchUser().then();
    }
  }, []);

  return { user, fetchUser };
};

export default useFetchUser;
