import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import './WatchPartyVideoPlayer.scss';

export default function WatchPartyVideoPlayer({
  videoState,
  onStateChange,
  isHost,
  videoUrl,
}) {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [seeking] = useState(false);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!isHost && !seeking) {
      const timeDiff = Math.abs(
        playerRef.current?.getCurrentTime() - videoState.timestamp
      );
      if (timeDiff > 1) {
        playerRef.current?.seekTo(videoState.timestamp, 'seconds');
      }
      setPlaying(videoState.playing);
    }
  }, [videoState, isHost, seeking]);

  const debounceUpdate = (action, value) => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 500) {
      lastUpdateRef.current = now;
      onStateChange({
        action,
        timestamp: value || playerRef.current?.getCurrentTime() || 0,
        playing,
      });
    }
  };

  const handlePlay = () => {
    setPlaying(true);
    if (isHost) {
      debounceUpdate('PLAY');
    }
  };

  const handlePause = () => {
    setPlaying(false);
    if (isHost) {
      debounceUpdate('PAUSE');
    }
  };

  const handleProgress = (progress) => {
    // if (isHost) {
    //   debounceUpdate('PROGRESS', progress);
    // }
  };

  return (
    <div className="watch-party-video-player">
      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          className="react-player"
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          progressInterval={500}
          controls={isHost}
        />
      </div>
    </div>
  );
}

WatchPartyVideoPlayer.propTypes = {
  videoState: PropTypes.object.isRequired,
  onStateChange: PropTypes.func.isRequired,
  isHost: PropTypes.bool.isRequired,
  videoUrl: PropTypes.string.isRequired,
};
