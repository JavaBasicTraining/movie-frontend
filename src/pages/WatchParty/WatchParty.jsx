import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ParticipantList from '../../component/ParticipantList/ParticipantList';
import SearchMovie from '../../component/SearchMovie/SearchMovie';
import TabControl from '../../component/TabControl/TabControl';
import WatchPartyChat from '../../component/WatchPartyChat/WatchPartyChat';
import WatchPartyVideoPlayer from '../../component/WatchPartyVideoPlayer/WatchPartyVideoPlayer';
import { useUser } from '../../contexts/UserContext';
import { roomService } from '../../services';
import { socketService } from '../../services/socketService';
import './WatchParty.scss';

const WatchParty = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [videoState, setVideoState] = useState({});
  const [isHost, setIsHost] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    let isSubscribed = true; // For cleanup handling

    if (user) {
      // Disconnect any existing connection first
      socketService.disconnect();
      socketService.connect(() => {
        if (isSubscribed) {
          setupSubscriptions();
          sendParticipantUpdate({
            roomId,
            user: { id: user?.id, username: user?.username },
          });
          sendChatMessage({
            content: `${user?.username} joined the room`,
            type: 'JOIN',
            sender: { id: user?.id, username: user?.username },
          });
          fetchRoom();
        }
      });
    }

    return () => {
      isSubscribed = false;
      // sendChatMessage({
      //   content: 'Goodbye',
      //   type: 'LEAVE',
      //   sender: { id: user?.id, username: user?.username },
      // });    
      socketService.disconnect();
    };
  }, [roomId, user]);

  useEffect(() => {
    if (user && room?.host) {
      console.log('room?.host: ', room?.host.id === user.id);
      setIsHost(room?.host.id === user.id);
    }

    if (user && socketService.connected) {
      sendParticipantUpdate({
        roomId,
        user: { id: user?.id, username: user?.username },
      });
    }
  }, [roomId, user, room?.host]);

  const fetchRoom = useCallback(() => {
    roomService.getRoomInfo(roomId).then((response) => {
      const room = response.data;
      setRoom(room);
    });
  }, []);

  const setupSubscriptions = useCallback(() => {
    // Subscribe to chat messages
    socketService.subscribe(`/topic/room/${roomId}/chat`, (message) => {
      setMessages((prev) => [...prev, message]);
      if (user?.id !== message.sender.id) {
        notification.info({
          message: buildMessage(message),
        });
      }
    });

    // Subscribe to video state updates
    socketService.subscribe(`/topic/room/${roomId}/video`, (state) => {
      console.log('state isHost: ', isHost);
      if (!isHost) {
        setVideoState(state);
      }
    });

    // Subscribe to participant updates
    socketService.subscribe(
      `/topic/room/${roomId}/participants`,
      (participants) => {
        setParticipants(participants);
      }
    );
  }, [isHost, roomId, user?.id]);

  const buildMessage = (message) => {
    if (message.type === 'JOIN') {
      return `${message.sender.username} joined the room`;
    } else if (message.type === 'LEAVE') {
      return `${message.sender.username} left the room`;
    }
    return `${message.sender.username}: ${message.content}`;
  };

  const sendParticipantUpdate = ({ roomId, user }) => {
    socketService.send(`/app/room/${roomId}/participants`, user);
  };

  const sendChatMessage = (chatMessage) => {
    socketService.send(`/app/room/${roomId}/chat`, {
      ...chatMessage,
      timestamp: new Date().toISOString(),
    });
  };

  const updateVideoState = (state) => {
    if (isHost) {
      setVideoState(state);
      socketService.send(`/app/room/${roomId}/video`, state);
    }
  };

  const handleMovieSelected = (movie) => {
    const newState = {
      ...videoState,
      movie,
      action: 'CHANGE',
      playing: false,
    };
    setVideoState(newState);
    updateVideoState(newState);
  };

  const handleSendChatMessage = (message) => {
    const chatMessage = {
      content: message,
      type: 'CHAT',
      sender: {
        id: user?.id,
        username: user?.username,
      },
    };
    sendChatMessage(chatMessage);
  };

  return (
    <div className="watch-party">
      <span className="watch-party__room-name">Room: {room?.name}</span>
      {/* Search movie */}
      {isHost && <SearchMovie onMovieSelected={handleMovieSelected} />}

      <div className="watch-party__content">
        {videoState.movie ? (
          <WatchPartyVideoPlayer
            videoState={videoState}
            onStateChange={updateVideoState}
            isHost={isHost}
          />
        ) : (
          <div className="watch-party__no-movie">No movie selected</div>
        )}
        <div className="watch-party__tab-control">
          <TabControl tabs={['Chat', 'Participants']}>
            <TabControl.TabContent name="Chat">
              <WatchPartyChat
                messages={messages.filter((message) => message.type === 'CHAT')}
                onSendMessage={handleSendChatMessage}
              />
            </TabControl.TabContent>
            <TabControl.TabContent name="Participants">
              <ParticipantList participants={participants ?? []} />
            </TabControl.TabContent>
          </TabControl>
        </div>
      </div>
      <div className="watch-party__chat">
        <div>playing: {JSON.stringify(videoState.playing)}</div>
        <div>action: {JSON.stringify(videoState.action)}</div>
        <div>timestamp: {JSON.stringify(videoState.timestamp)}</div>
      </div>
    </div>
  );
};

export default WatchParty;
