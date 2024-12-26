import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { spinnerService } from '../../services/spinnerService';
import { LoadingOutlined } from '@ant-design/icons';

export const Loading = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSpinnerChange = (value) => {
      setLoading(value);
    };

    spinnerService.subscribe(handleSpinnerChange);

    return () => {
      spinnerService.unsubscribe();
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
