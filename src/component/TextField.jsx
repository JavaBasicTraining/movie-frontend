import React from 'react';
import PropTypes from 'prop-types';
import './TextField.scss';
import CustomInput from './CustomInput';
import _ from 'lodash';

function TextField(props) {
  const { helperText, children, ...inputProps } = props;

  return (
    <CustomInput {...props} className="TextField">
      <input
        className="TextField__input"
        {..._.omit(inputProps, 'fullWidth')}
      />
    </CustomInput>
  );
}

TextField.propTypes = {
  helperText: PropTypes.string,
  children: PropTypes.node,
};

export default TextField;
