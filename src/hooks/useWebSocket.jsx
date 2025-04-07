import { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const useWebSocket = (setListComment, movieId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const stompClient = useRef(null);
  const [userRole, setUserRole] = useState();

  const sendMessage = (message) => {
    if (!stompClient.current?.connected) {
      console.error('Socket is not connected.');
      return;
    }

    if (!userRole) {
      console.error('Permission denied: user role not defined.');
      return;
    }

    const enhancedMessage = {
      ...message,
      role: userRole,
    };

    stompClient.current.send(
      '/app/sendComment',
      {},
      JSON.stringify(enhancedMessage)
    );
  };

  const onMessage = useCallback(() => {
    setIsConnected(true);
    stompClient.current?.subscribe(`/topic/comment/${movieId}`, (message) => {
      const newComment = JSON.parse(message.body);
      setListComment((prevComments) => {
        if (newComment?.parentCommentId) {
          const updatedComments = prevComments.map((comment) => {
            if (comment.id === newComment.parentCommentId) {
              const updated = {
                ...comment,
                replies: [...(comment.replies ?? []), { ...newComment }],
              };
              console.log('Đã thêm reply vào comment:', updated);
              return updated;
            }
            return comment;
          });
          console.log('Danh sách comment sau khi thêm reply:', updatedComments);

          return updatedComments;
        } else {
          return [...prevComments, { ...newComment, replies: [] }];
        }
      });
      setLastMessage(newComment);
    });
  }, [movieId, setListComment]);

  const onError = (frame) => {
    console.error('Socket connection error:', frame.body);
  };

  useEffect(() => {
    if (!stompClient.current?.isConnected) {
      console.log("connecting...")
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found.');
        return;
      }

      const url = `http://localhost:8081/ws?access_token=${token}`;
      const socket = new SockJS(url);
      stompClient.current = Stomp.over(socket);

      try {
        const parsedToken = parseJwt(token);
        const roles =
          parsedToken.resource_access?.movie_website_client?.roles || [];
        setUserRole(roles.includes('admin') ? 'admin' : 'user');
      } catch (error) {
        console.error('Error parsing token:', error);
        setUserRole(null);
      }

      stompClient.current.connect({}, onMessage, onError);
    }

    return () => {
      stompClient.current?.disconnect(() => {
        setIsConnected(false);
      });
    };
  }, [onMessage]);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Failed to parse token:', error);
      return {};
    }
  };

  return {
    sendMessage,
    lastMessage,
    isConnected,
  };
};

export default useWebSocket;
