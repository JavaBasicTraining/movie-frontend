import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const useWebSocket = (setListComment, movieId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const stompClient = useRef(null);
  const [userRole, setUserRole] = useState();
  const [acTion, setAction] = useState();

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
      JSON.stringify({
        action: 'ADD',
        data: enhancedMessage,
      })
    );
  };

  const onMessage = () => {
    setIsConnected(true);
    stompClient.current?.subscribe(`/topic/comment/${movieId}`, (message) => {
      const messageData = JSON.parse(message.body);
      const { action, data } = messageData;

      console.log('Received action:', action);
      setAction(action);

      setListComment((prevComments) => {
        const updateOrAddComment = (comments, data) => {
          return comments.map((comment) => {
            if (comment.id === data.parentCommentId) {
              const updatedReplies = [
                ...(comment.replies ?? []).filter(
                  (reply) => reply.id !== data.id
                ),
                data,
              ];
              return {
                ...comment,
                replies: updatedReplies,
                totalReplies: updatedReplies.length,
              };
            }

            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateOrAddComment(comment.replies, data),
              };
            }

            return comment;
          });
        };

        const deleteCommentById = (comments, idToDelete) => {
          return comments
            .filter((comment) => comment.id !== idToDelete)
            .map((comment) => ({
              ...comment,
              replies: deleteCommentById(comment.replies ?? [], idToDelete),
              totalReplies: deleteCommentById(comment.replies ?? [], idToDelete)
                .length,
            }));
        };
        switch (action) {
          case 'ADD':
          case 'UPDATE': {
            if (data?.parentCommentId) {
              return updateOrAddComment(prevComments, data);
            } else {
              const isExist = prevComments.some(
                (comment) => comment.id === data.id
              );
              if (isExist) {
                return prevComments.map((comment) => {
                  if (comment.id === data.id) {
                    return {
                      ...comment,
                      content: data.content,
                      replies: comment.replies ?? [],
                    };
                  }
                  return comment;
                });
              } else {
                return [...prevComments, { ...data, replies: [] }];
              }
            }
          }
          case 'DELETE': {
            return deleteCommentById(prevComments, data);
          }
          default:
            return prevComments;
        }
      });

      setLastMessage(data);
    });
  };

  const onError = (frame) => {
    console.error('Socket connection error:', frame.body);
  };

  useEffect(() => {
    if (!stompClient.current?.isConnected) {
      console.log('connecting...');
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
  }, []);

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
    acTion,
  };
};

export default useWebSocket;
