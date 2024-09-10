import React from 'react';
import PropTypes from 'prop-types';
import './TextField.scss';
import CustomInput from './CustomInput';

function TextField(props) {
  const { label, helperText, fullWidth, children, ...inputProps } = props;

  return (
    <CustomInput {...props} className='TextField'>
      <input className="TextField__input" {...inputProps} />
    </CustomInput>
  );
}

TextField.propTypes = {
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
};

TextField.defaultProps = {
  label: 'Label',
  fullWidth: false,
};

export default TextField;
