import React, { useState } from 'react';
import CustomIcon, { iconRegistry } from '../CustomIcon';
import PropTypes from 'prop-types';
import './FileUploadInput.scss';
import ImagePreview from '../ImagePreview/ImagePreview';

function FileUploadInput(props) {
  const { label, source, type, helperText, ...inputProps } = props;
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
      inputProps?.onChange?.(e);
    }
  };

  return (
    <div className="FileUploadInput">
      <label className="FileUploadInput__label" htmlFor={props.name}>
        <CustomIcon icon={iconRegistry.upload} color="white" />
        {label}
      </label>

      <input
        {...inputProps}
        className="FileUploadInput__input"
        type="file"
        onChange={handleChange}
      />

      {helperText && (
        <small className="FileUploadInput__helper-text">{helperText}</small>
      )}

      {preview && !helperText && (
        <div className="FileUploadInput__preview">
          {preview.type.includes('image') && <ImagePreview preview={preview} />}

          {preview.type.includes('video') && (
            <video className="video-preview" src={preview.value} controls />
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
