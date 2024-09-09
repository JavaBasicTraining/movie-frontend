import React from 'react';
import PropTypes from 'prop-types';

export const iconRegistry = {
  upload: '/icons/file-upload-solid.svg',
};

function CustomIcon(props) {
  const { size, icon, color } = props;
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

CustomIcon.defaultProps = {
  size: 20,
  color: 'black',
};

export default CustomIcon;
