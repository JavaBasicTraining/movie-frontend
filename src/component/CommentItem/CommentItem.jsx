import { LikeOutlined } from '@ant-design/icons';
import { Button, Modal, notification } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { CommentInput } from '../';
import useFetchUser from '../../hooks/useFetchUser';
import { commentService } from '../../services/commentService';
import './CommentItem.scss';

export function CommentItem(props) {
  const { comment, movieId, onDeleted } = props;
  const { user } = useFetchUser();
  const [showOptions, setShowOptions] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);
  const [replies, setReplies] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editComment, setEditComment] = useState(() => comment);
  const [replyContent, setReplyContent] = useState('');

  const fetchLikeCount = useCallback(() => {
    commentService.getLikeCount(comment.id).then((res) => {
      setEditComment({
        ...comment,
        totalLikes: res.data.totalLikes,
      });
    });
  }, [comment]);

  useEffect(() => {
    // hide options when click outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.comment__option-container')) {
        setShowOptions(false);
      }
    };

    fetchLikeCount();

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getTimeDifference = (currentDate) => {
    const now = new Date();
    const commentTime = new Date(currentDate);
    const timeDifference = now - commentTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (minutesDifference < 1) return 'Vừa xong';
    if (minutesDifference < 60) return `${minutesDifference} phút trước`;
    if (hoursDifference < 24) return `${hoursDifference} giờ trước`;
    if (daysDifference <= 7) return `${daysDifference} ngày trước`;

    const day = commentTime.getDate();
    const month = commentTime.getMonth() + 1;
    const year = commentTime.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    setEditing(true);
    setShowOptions(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bình luận này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await commentService.delete(comment.id);
          notification.success({ message: 'Xóa thành công' });
          onDeleted?.(comment.id);
        } catch (error) {
          notification.error({
            message: `Lỗi khi xóa bình luận: ${error.message}`,
          });
        }
      },
    });
  };

  const toggleReply = () => {
    setShowReply(!showReply);
  };

  const handleLike = () => {
    commentService.likeComment(comment.id, true).then((res) => {
      setEditComment({
        ...comment,
        totalLikes: res.data.totalLikes ?? 0,
      });
    });
  };

  const handleSubmitReply = () => {
    const request = {
      content: replyContent,
      movie: {
        id: movieId,
      },
      user: {
        id: user.id,
      },
      parentComment: {
        id: comment.id,
      },
    };
    commentService.create(request).then(() => {
      setReplyContent('');
      setShowReply(false);
    });
  };

  const handleEditCommentChange = (e) => {
    setEditComment({
      ...comment,
      content: e.target.value,
    });
  };

  const handleReplyContentChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleCancelReply = () => {
    setReplyContent('');
    setShowReply(false);
  };

  const handleSubmitEdit = () => {
    commentService.update(comment.id, editComment).then((res) => {
      setEditComment({
        ...res.data,
        content: editComment.content,
      });
      setEditing(false);
    });
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleToggleReplyList = () => {
    fetchReplies();
    setShowReplyList(!showReplyList);
  };

  const fetchReplies = (page = 0) => {
    commentService.getReplies(comment.id, page).then((res) => {
      setReplies(res.data);
    });
  };

  return (
    <div className="comment">
      <div className="comment__header">
        <span className="comment__username">@{comment.user.userName} </span>
        <span className="comment__time">
          {getTimeDifference(comment.createdDate)}
        </span>
      </div>
      <div className="comment__content-container">
        <div className="comment__content">
          {editing ? (
            <CommentInput
              value={editComment.content}
              onChange={handleEditCommentChange}
              onSubmit={handleSubmitEdit}
              onCancel={handleCancelEdit}
              submitText="Sửa"
              cancelText="Huỷ"
            />
          ) : (
            <p className="comment__text">{editComment.content}</p>
          )}

          {!editing && (
            <div className="comment__option-container">
              <button
                className="comment__option-toggle btn-non-style"
                onClick={toggleOptions}
              >
                ...
              </button>

              {showOptions && (
                <div className="comment__option-list">
                  <Button className="comment__option-item" onClick={handleEdit}>
                    Sửa
                  </Button>
                  <Button
                    className="comment__option-item"
                    onClick={handleDelete}
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="comment__actions">
          <Button
            className="comment__action"
            onClick={handleLike}
            icon={<LikeOutlined />}
          >
            ({editComment.totalLikes ?? 0})
          </Button>
          <Button className="comment__action" onClick={toggleReply}>
            Trả lời
          </Button>
        </div>

        <div className="comment__reply">
          {showReply && (
            <CommentInput
              value={replyContent}
              onChange={handleReplyContentChange}
              onSubmit={handleSubmitReply}
              onCancel={handleCancelReply}
              submitText="Phản hồi"
              cancelText="Huỷ"
            />
          )}

          {editComment.totalReplies > 0 && (
            <Button
              className="comment__reply-list-toggle"
              onClick={handleToggleReplyList}
            >
              {showReplyList
                ? 'Ẩn'
                : `Xem ${editComment.totalReplies} phản hồi`}
            </Button>
          )}

          {showReplyList && (
            <div className="comment__reply-list-container">
              <div className="comment__reply-list-tree"></div>
              <div className="comment__reply-list">
                {replies.map((reply) => (
                  <div key={reply.id} className="comment__reply-list-item">
                    <div className="comment__reply-list-item-left-line"></div>
                    <CommentItem comment={reply} movieId={movieId} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  movieId: PropTypes.number.isRequired,
  onDeleted: PropTypes.func,
};
