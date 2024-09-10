import React from 'react';
import CustomInput from './CustomInput';
import PropTypes from 'prop-types';
import './SelectField.scss';
import { MultiSelect } from 'react-multi-select-component';
import _ from 'lodash';

function SelectField(props) {
  const {
    items = [],
    placeholder = 'Select an option',
    multiple,
    ...selectProps
  } = props;

  return (
    <CustomInput {...props} className="SelectField">
      {multiple ? (
        <MultiSelect
          options={items}
          {...selectProps}
          className="SelectField__multi-select"
        />
      ) : (
        <select
          className="SelectField__select"
          {..._.omit(selectProps, 'helperText', 'fullWidth')}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {items.map((item) => (
            <option key={item.label} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}
    </CustomInput>
  );
}

SelectField.propTypes = {
  items: PropTypes.array,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
};

export default SelectField;
