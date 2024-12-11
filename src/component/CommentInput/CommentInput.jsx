import { Button, Input } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CommentInput.scss';

export function CommentInput(props) {
  const {
    value,
    onChange,
    submitText = 'Bình luận',
    cancelText = 'Huỷ',
    onSubmit,
    onCancel,
  } = props;
  const [showActions, setShowActions] = useState(false);

  const handleCommentChange = (e) => {
    onChange?.(e);
    setShowActions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit?.(value);
      setShowActions(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setShowActions(false);
  };

  const handleSubmit = () => {
    onSubmit?.(value);
    setShowActions(false);
  };

  const handleFocus = () => {
    setShowActions(true);
  };

  return (
    <div className="comment-input">
      <Input
        className="input"
        type="text"
        value={value}
        placeholder="Nhập bình luận của bạn..."
        onChange={handleCommentChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        required
      />
      {showActions && (
        <div className="comment-input__actions">
          <Button onClick={handleCancel}>{cancelText}</Button>
          <Button onClick={handleSubmit} disabled={!value.trim()}>
            {submitText}
          </Button>
        </div>
      )}
    </div>
  );
}

CommentInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};
