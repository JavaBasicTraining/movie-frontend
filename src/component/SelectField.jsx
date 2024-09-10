import React from 'react';
import CustomInput from './CustomInput';
import PropTypes from 'prop-types';
import './SelectField.scss';
import { MultiSelect } from 'react-multi-select-component';

function SelectField(props) {
  const { items, placeholder, multiple, ...selectProps } = props;

  return (
    <CustomInput {...props} className="SelectField">
      {multiple ? (
        <MultiSelect
          options={items}
          {...selectProps}
          className="SelectField__multi-select"
        />
      ) : (
        <select className="SelectField__select" {...selectProps}>
          <option value="" disabled>
            {placeholder}
          </option>

          {items.map((item) => (
            <option key={item.value} value={item.value}>
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
  multiple: PropTypes.bool
};

SelectField.defaultProps = {
  items: [],
  placeholder: 'Select an option',
};

export default SelectField;