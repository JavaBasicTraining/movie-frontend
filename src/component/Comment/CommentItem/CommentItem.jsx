import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import './CommentItem.scss';
import useFetchUser from '../../../hooks/useFetchUser';
import { commentService } from '../../../services/commentService';
import { CommentInput } from '../CommentInput/CommentInput';
import { Button, Modal, notification } from 'antd';
import { LikeOutlined } from '@ant-design/icons';

const CommentItem = (props) => {
  const { comment, movieId, onDeleted } = props;
  const [showOption, setShowOption] = useState(false);
  const { user } = useFetchUser();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReplyList, setShowReplyList] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [editComment, setEditComment] = useState(() => comment);

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

  const hasNext = (comments, index) => {
    return (
      Array.isArray(comments) &&
      comments.length > 1 &&
      index < comments.length - 1
    );
  };

  const handleShowOption = () => {
    setShowOption(true);
    if (showOption == true) {
      setShowOption(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.comment-item__header-option')) {
        setShowOption(false);
      }
    };


    fetchLikeCount();
    fetchReplies();

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const fetchReplies = (page = 0) => {
    commentService.getReplies(comment.id, page).then((res) => {
      setReplies(res.data);
      setEditComment({
        ...comment,
        totalReplies: res.data.length ?? 0,
      });
    });
  };
  const handleEdit = () => {
    setEditing(true);
    setShowOption(false);
  };
  const handleCancelEdit = () => {
    setEditComment(comment);
    setEditing(false);
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
  const handleEditCommentChange = (e) => {
    setEditComment({
      ...comment,
      content: e.target.value,
    });
  };

  const handleLike = () => {
    let isLikeAction = true;
    if (editComment.userHasLiked) {
      isLikeAction = false;
    }
    commentService.likeComment(comment.id, isLikeAction).then((res) => {
      setEditComment({
        ...editComment,
        totalLikes: res.data.totalLikes ?? 0,
        userHasLiked: isLikeAction,
      });
    });
    fetchLikeCount();
  };

  const handleDeleteComment = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bình luận này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
        
        
            onDeleted?.(comment.id);
          await commentService.delete(comment.id);
          notification.success({ message: 'Xóa thành công' });
        } catch (error) {
          notification.error({
            message: `Lỗi khi xóa bình luận: ${error.message}`,
          });
        }
      },
    });
  };
  

  const fetchLikeCount = useCallback(() => {
    commentService.getLikeCount(comment.id).then((res) => {
      setEditComment({
        ...comment,
        totalLikes: res.data.totalLikes,
      });
    });
  }, [comment]);

  const handleToggleReplyList = () => {
    fetchReplies();
    setShowReplyList(!showReplyList);
  };
  const toggleReply = () => {
    setShowReplyInput(!showReplyInput);
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
      setShowReplyList(true);
      setShowReplyInput(false);
      fetchReplies();
    });
  };
  const handleReplyContentChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleCancelReply = () => {
    setReplyContent('');
    setShowReplyInput(false);
  };  
  const handleReplyDeleted = (replyId) => {
    const updatedReplies = replies.filter((reply) => reply.id !== replyId);
    setReplies(updatedReplies);
    setEditComment((prev) => ({
      ...prev,
      totalReplies: updatedReplies.length,
    }));
  };
  return (
    <div className="comment-container">
      <div className="list-tree-container">
        <div className="comment-item">
          <div className="comment-item__main-content">
            {(editComment.totalReplies > 0  || showReplyInput)&& <div className="trunk"></div>}
            <div className="comment-item__header">
              <div className="comment-item__header-title">
                <div className="comment-item__avatar"></div>
                <h1 className="userName"> @{comment.user.userName}</h1>
              </div>

              <div className="comment-item__header-option">
                <button className="show-option" onClick={handleShowOption}>
                  ...
                </button>
                {showOption && user.id === comment.user.id && (
                  <div className="action">
                    <button onClick={handleEdit}>Chỉnh sửa</button>
                    <button onClick={handleDeleteComment}> Xóa</button>
                  </div>
                )}
              </div>
            </div>

            <div className="comment-item__body">
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

              <div className="comment-item__like-reply">
                <span className="time-comment">
                  {getTimeDifference(comment.createdDate)}
                </span>
                <Button onClick={handleLike} icon={<LikeOutlined />}>
                  ({editComment.totalLikes ?? 0})
                </Button>
                <button onClick={toggleReply}>Trả lời</button>
              </div>
            </div>
          </div>

          <div className="comment-item__replies">
            {showReplyInput && (
              <div className="intput-container">
                {(showReplyInput && editComment.totalReplies > 0) && <div className="trunk-replies-input"></div>}
                <div className='line-input-container'>
                  <div className="line-input"></div>
                  <CommentInput
                    value={replyContent}
                    onChange={handleReplyContentChange}
                    onSubmit={handleSubmitReply}
                    onCancel={handleCancelReply}
                    submitText="Phản hồi"
                    cancelText="Huỷ"
                  />
                </div>
              </div>
            )}
            <div className="line-replies">
              <div className="line-replies-btn-container">
                {(showReplyList && editComment.totalReplies > 0) && (
                  <div className="trunk-show-replies-btn"></div>
                )}

                <div className="line-btn">
                  {editComment.totalReplies > 0 && (
                    <div className="list-tree-line-replies-btn"></div>
                  )}
                  {editComment.totalReplies > 0 && (
                    <Button
                      className="comment__reply-list-toggle"
                      onClick={handleToggleReplyList}
                    >
                      {(showReplyList && editComment.totalReplies>0)
                        ? 'Ẩn'
                        : `Xem ${editComment.totalReplies} phản hồi`}
                    </Button>
                  )}
                </div>
              </div>
              {showReplyList && (
                <div className="repies-line">
                  <div className="comment__reply-list-container">
                    <div className="comment__reply-list">
                      {replies.map((reply, index) => (
                        <div
                          key={reply.id}
                          className="comment__reply-list-item"
                        >
                          <div className="trunk-line-container">
                            {hasNext(replies, index) && (
                              <div className="trunk-replies"></div>
                            )}
                            <div className="line-item">
                              <div className="list-tree-line"></div>
                              <CommentItem
                                comment={reply}
                                movieId={movieId}
                                onDeleted={handleReplyDeleted}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
