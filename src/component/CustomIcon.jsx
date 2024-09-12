import React from 'react';
import PropTypes from 'prop-types';

export const iconRegistry = {
  upload: '/icons/file-upload-solid.svg',
};

function CustomIcon(props) {
  const { size = 20, icon, color = 'black' } = props;
  return (
    <div
      style={{
        width: size,
        height: size,
        mask: `url(${icon}) no-repeat center`,
        background: `${color}`,
      }}
    ></div>
  );
}

CustomIcon.propTypes = {
  size: PropTypes.number,
  icon: PropTypes.any,
  color: PropTypes.string,
};

export default CustomIcon;
