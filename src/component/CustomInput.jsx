import React from 'react';
import './CustomInput.scss';
import PropTypes from 'prop-types';

function CustomInput(props) {
  const { label, helperText, fullWidth = false, children } = props;

  return (
    <div
      className={`CustomInput ${props.className ? props.className : ''} ${fullWidth && 'full-width'}`}
    >
      {label && <label className="CustomInput__label">{label}</label>}

      <div className="CustomInput__input-wrapper">
        {children}

        {helperText && (
          <small className="CustomInput__helper-text">{helperText}</small>
        )}
      </div>
    </div>
  );
}

CustomInput.propTypes = {
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default CustomInput;
