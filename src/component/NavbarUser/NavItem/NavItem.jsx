import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './NavItem.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faList,
} from '@fortawesome/free-solid-svg-icons';

export const NavItem = (props) => {
  const {
    name = '',
    path,
    basePath = '',
    subItems = [],
    icon,
    onItemClick,
  } = props;
  const navigate = useNavigate();
  const [showSubItems, setShowSubItems] = useState(false);

  const handleItemClick = useCallback(() => {
    if (path === undefined || path === null) {
      return;
    }
    const url = `${basePath}/${path}`;
    navigate(url);
    onItemClick?.();
  }, [path, basePath, navigate, onItemClick]);

  return (
    <div className="NavItem">
      <div
        className={`NavItem__label-icon ${showSubItems ? 'NavItem__label-icon--active' : ''}`}
      >
        <FontAwesomeIcon icon={icon ?? faList} size="1x" />
        <button
          className="NavItem__label btn-non-style f-normal"
          onClick={handleItemClick}
        >
          {name}
        </button>

        {subItems?.length > 0 && (
          <FontAwesomeIcon
            icon={showSubItems ? faChevronUp : faChevronDown}
            onClick={() => setShowSubItems(!showSubItems)}
          />
        )}
      </div>

      {showSubItems && subItems?.length > 0 && (
        <div className="NavItem__sub-items">
          {subItems.map((subItem) => (
            <NavItem key={subItem.name} {...subItem} basePath={basePath} />
          ))}
        </div>
      )}
    </div>
  );
};

NavItem.propTypes = {
  name: PropTypes.string,
  path: PropTypes.string,
  basePath: PropTypes.string,
  icon: PropTypes.object,
  subItems: PropTypes.array,
  onItemClick: PropTypes.func,
};
