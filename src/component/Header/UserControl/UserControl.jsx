import React from 'react';
import './UserControl.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export const UserControl = () => {
  return (
    <div className="UserControl">
      <FontAwesomeIcon icon={faBell} />
      <span className="UserControl__username">Username</span>
      <div className="UserControl__avatar"></div>
    </div>
  );
};
