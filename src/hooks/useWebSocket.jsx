import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useLoaderData } from 'react-router-dom';

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState();
  const stompClient = useRef(null);
  const room = useLoaderData();
  const [videoState, setVideoState] = useState();
  const [action, setAction] = useState();

  const sendMessage = (message) => {
    if (stompClient?.current?.connected) {
      stompClient.current.send('/app/sendMessage', {}, JSON.stringify(message));
    } else {
      console.error('Socket is not connected.');
    }
  };

  const sendVideo = (video) => {
    if (!video || typeof video !== 'object') {
      console.error('Invalid video data');
      return;
    }
    if (stompClient?.current?.connected) {
      try {
        stompClient.current.send(`/app/room/${room?.id}/video`, {}, JSON.stringify(video));
        console.log('Video frame sent successfully.');
      } catch (error) {
        console.error('Error sending video frame:', error);
      }
    } else {
      console.error('WebSocket is not connected.');
    }
  };

  const onVideo = () => {
    if (!stompClient?.current?.connected) {
      console.error('WebSocket is not connected.');
      return;
    }
    stompClient.current.subscribe(`/topic/room/${room?.id}/video`, (messageOutput) => {
      try {
        const videoData = JSON.parse(messageOutput.body);
        setVideoState(videoData);
      } catch (error) {
        console.error('Error parsing video message:', error);
      }
    });
  };

  const onMessage = () => {
    stompClient.current?.subscribe('/topic/messages', (messageOutput) => {
      setLastMessage(JSON.parse(messageOutput.body));
    });
    setIsConnected(true);
  };

  const onError = (frame) => {
    console.error('Socket connection error:', frame.body);
  };

  useEffect(() => {
    if (!room?.id) {
      console.error('Room ID is undefined');
      return;
    }
    onVideo();
  }, [room?.id]);

  useEffect(() => {
    const url = `http://localhost:8081/ws`;
    const socket = new SockJS(url);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, onMessage, onError);

    return () => {
      if (stompClient?.current?.connected) {
        stompClient.current.disconnect(() => {
          setIsConnected(false);
        });
      }
    };
  }, []);

  return {
    sendMessage,
    lastMessage,
    isConnected,
    videoState,
    action,
  };
};

export default useWebSocket;
