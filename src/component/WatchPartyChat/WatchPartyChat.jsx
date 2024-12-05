import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './WatchPartyChat.scss';
import { useUser } from '../../contexts/UserContext';
export default function WatchPartyChat(props) {
  const { user } = useUser();
  const { messages = [], onSendMessage } = props;
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSendMessage?.(message);
      setMessage('');
    }
  };

  const handleSendClick = (e) => {
    onSendMessage?.(message);
    setMessage('');
  };

  return (
    <div className="watch-party-chat">
      <div className="watch-party-chat__message-list">
        {messages.map((message, index) => (
          <div
            ref={messageRef}
            key={`${index}:${message.id}`}
            className={`watch-party-chat__message ${
              message.sender.id === user?.id
                ? 'watch-party-chat__message--self'
                : ''
            }`}
          >
            <span className="watch-party-chat__message-sender">
              {message.sender.id === user?.id ? 'You' : message.sender.username}:
            </span>
            <span className="watch-party-chat__message-content">
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <div className="watch-party-chat__message-input">
        <input
          className="watch-party-chat__message-input-textarea"
          type="text"
          onKeyDown={handleKeyDown}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="watch-party-chat__send-button"
          onClick={handleSendClick}
        >
          Send
        </button>
      </div>
    </div>
  );
}

WatchPartyChat.propTypes = {
  messages: PropTypes.array.isRequired,
  onSendMessage: PropTypes.func.isRequired,
};
