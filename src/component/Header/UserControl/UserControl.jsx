import React from 'react';
import './UserControl.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../hooks';
import { Avatar, Dropdown } from 'antd';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';

export const UserControl = () => {
  const { user } = useAuth();

  const handleChevronDownClick = () => {};

  return (
    <div className="UserControl">
      <FontAwesomeIcon icon={faBell} />
      <span className="UserControl__username">{user?.userName}</span>

      <Dropdown menu={{ items }}>
        <div className="UserControl__avatar">
          <Avatar size="large" icon={<UserOutlined />} />
          <FontAwesomeIcon
            className="avatar-chevron-down"
            icon={faChevronDown}
            onClick={handleChevronDownClick}
          />
        </div>
      </Dropdown>
    </div>
  );
};

const items = [
  {
    key: '1',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];
