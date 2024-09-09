import React, { useState } from 'react';
import CustomIcon, { iconRegistry } from './CustomIcon';
import PropTypes from 'prop-types';
import './FileUploadInput.scss';

function FileUploadInput(props) {
  const { label, source, ...inputProps } = props;
  const [preview, setPreview] = useState(source);

  const handleChange = (e) => {
    const { files } = e.target;
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview({
        value: url,
        type: file.type,
      });
    } else {
      setPreview(null);
    }

    inputProps?.onChange?.(e);
  };

  return (
    <div className="FileUploadInput">
      <label className="FileUploadInput__label" htmlFor="poster">
        <CustomIcon icon={iconRegistry.upload} color="white" />
        {label}
      </label>

      <input
        {...inputProps}
        className="FileUploadInput__input"
        type="file"
        onChange={handleChange}
      />

      {preview && (
        <div className="FileUploadInput__preview">
          {preview.type.includes('image') && (
            <div className="image-view">
              <img
                className="image-view__img"
                src={preview.value}
                alt={'view-source'}
              />
            </div>
          )}

          {preview.type.includes('video') && (
            <video className="image-view__img" src={preview.value} controls />
          )}
        </div>
      )}
    </div>
  );
}

FileUploadInput.propTypes = {
  label: PropTypes.string,
  source: PropTypes.object,
};

FileUploadInput.defaultProps = {
  label: 'Upload',
};

export default FileUploadInput;
