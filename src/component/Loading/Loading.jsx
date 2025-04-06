import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { loadingService } from '../../services';
import { LoadingOutlined } from '@ant-design/icons';

export const Loading = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSpinnerChange = (value) => {
      setLoading(value);
    };

    loadingService.subscribe(handleSpinnerChange);

    return () => {
      loadingService.unsubscribe();
    };
  }, []);

  return (
    <Spin
      indicator={<LoadingOutlined spin />}
      spinning={loading}
      size="large"
      fullscreen
    />
  );
};
