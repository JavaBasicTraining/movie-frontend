import React from 'react';
import './UserControl.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../hooks';

export const UserControl = () => {
  const { user } = useAuth();

  return (
    <div className="UserControl">
      <FontAwesomeIcon icon={faBell} />
      <span className="UserControl__username">{user?.userName}</span>
      <div className="UserControl__avatar"></div>
    </div>
  );
};
