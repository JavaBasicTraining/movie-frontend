import React from 'react';
import CustomInput from './CustomInput';
import PropTypes from 'prop-types';
import './SelectField.scss';
import _ from 'lodash';
import Select from 'react-select';

function SelectField(props) {
  const {
    placeholder = 'Select an option',
    multiple = false,
    ...selectProps
  } = props;

  return (
    <CustomInput {...props} className="SelectField">
      <Select
        {..._.omit(selectProps, 'helperText', 'fullWidth')}
        className="SelectField__select"
        placeholder={placeholder}
        isMulti={multiple}
        classNames={{
          menuList: () => 'menu-list',
        }}
      />
    </CustomInput>
  );
}

SelectField.propTypes = {
  options: PropTypes.array,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  value: PropTypes.any,
};

export default SelectField;
