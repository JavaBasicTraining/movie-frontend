import React from 'react';
import './CustomInput.scss';
import PropTypes from 'prop-types';

function CustomInput(props) {
  const { label, helperText, fullWidth, children } = props;

  return (
    <div
      className={`CustomInput ${props.className ? props.className : ''} ${fullWidth && 'full-width'}`}
    >
      <label className="CustomInput__label">{label}</label>

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
  fullWidth: PropTypes.bool
};

CustomInput.defaultProps = {
  label: 'Label',
  fullWidth: false
};

export default CustomInput;