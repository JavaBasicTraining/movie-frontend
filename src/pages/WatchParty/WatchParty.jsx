import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '../../services/socketService';
import WatchPartyVideoPlayer from '../../component/WatchPartyVideoPlayer/WatchPartyVideoPlayer';
import ParticipantList from '../../component/ParticipantList/ParticipantList';
import { roomService } from '../../services';
import SearchMovie from '../../component/SearchMovie/SearchMovie';
import './WatchParty.scss';
import useFetchUser from '../../hooks/useFetchUser';

const defaultParticipants = [
  {
    id: 1,
    username: 'Huy',
  },
  {
    id: 2,
    username: 'Hai',
  },
];

const WatchParty = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [movie, setMovie] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState(defaultParticipants);
  const [messages, setMessages] = useState([]);
  const [videoState, setVideoState] = useState({
    playing: false,
    timestamp: 0,
  });
  const [isHost, setIsHost] = useState(true);
  const { user } = useFetchUser();

  useEffect(() => {
    fetchRoom();
    socketService.connect(() => {
      setConnected(true);
      setupSubscriptions();
    });

    return () => socketService.disconnect();
  }, []);

  useEffect(() => {
    if (user && room?.host) {
      setIsHost(room?.host.id === user.id);
      sendParticipantUpdate({
        roomId,
        user: { id: user?.id, username: user?.username },
      });
    }
  }, [room, user]);

  const fetchRoom = () => {
    roomService.getRoomInfo(roomId).then((response) => {
      const room = response.data;
      setRoom(room);
    });
  };

  const setupSubscriptions = () => {
    // Subscribe to chat messages
    socketService.subscribe(`/topic/room/${roomId}/chat`, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Subscribe to video state updates
    socketService.subscribe(`/topic/room/${roomId}/video`, (state) => {
      setVideoState(state);
      console.log(state);
    });

    // Subscribe to participant updates
    socketService.subscribe(`/topic/room/${roomId}/participants`, (participants) => {
      console.log('participants: ', participants);
      setParticipants(participants);
    });

    sendChatMessage({
      roomId,
      username: user?.username,
      content: '',
      type: 'JOIN',
    });
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
    socketService.send(`/app/room/${roomId}/video`, {
      roomId,
      username: user?.username,
      ...state,
      eventTime: new Date().toISOString(),
    });
  };

  const handleMovieSelected = (movie) => {
    setMovie(movie);
  };

  return (
    <div className="watch-party">
      <span className="watch-party__room-name">Room: {room?.name}</span>
      <span className="watch-party__participants-count">
        - Joined: {participants?.length ?? 0}
      </span>
      {/* Search movie */}
      {isHost && <SearchMovie onMovieSelected={handleMovieSelected} />}

      <div className="watch-party__content">
        {movie ? (
          <WatchPartyVideoPlayer
            videoState={videoState}
            onStateChange={updateVideoState}
            isHost={isHost}
            videoUrl={movie.videoUrl}
          />
        ) : (
          <div className="watch-party__no-movie">No movie selected</div>
        )}
        <div className="watch-party__participant-list">
          <ParticipantList participants={participants ?? []} />
        </div>
      </div>
    </div>
  );
};

export default WatchParty;
