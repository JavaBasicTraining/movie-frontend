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

  const [comment, setComment] = useState(value);
  const [showActions, setShowActions] = useState(false);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit?.(comment);
    }
  };

  const handleCancel = () => {
    setComment('');
    onCancel?.();
    setShowActions(false);
  };

  const handleSubmit = () => {
    onSubmit?.(comment);
  };

  const handleFocus = () => {
    setShowActions(true);
  };

  return (
    <div className="comment-input">
      <Input
        className="input"
        type="text"
        value={comment}
        placeholder="Nhập bình luận của bạn..."
        onChange={handleCommentChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        required
      />
      {showActions && (
        <div className="comment-input__actions">
          <Button onClick={handleCancel}>{cancelText}</Button>
          <Button onClick={handleSubmit} disabled={!comment.trim()}>
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
