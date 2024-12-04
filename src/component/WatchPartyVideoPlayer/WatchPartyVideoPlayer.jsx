import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import './WatchPartyVideoPlayer.scss';

export default function WatchPartyVideoPlayer({
  videoState,
  onStateChange,
  isHost,
}) {
  const playerRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useLayoutEffect(() => {
    playerRef.current?.seekTo(videoState.timestamp);
  }, [videoState]);

  const handlePlay = () => {
    if (isHost) {
      onStateChange({
        ...videoState,
        action: 'PLAY',
        timestamp: playerRef.current?.getCurrentTime() || 0,
        playing: true,
      });
    }
  };

  const handlePause = () => {
    if (isHost) {
      onStateChange({
        ...videoState,
        action: 'PAUSE',
        timestamp: playerRef.current?.getCurrentTime() || 0,
        playing: false,
      });
    }
  };

  const handleProgress = (progress) => {
    if (isHost) {
      const timeDiff = Math.abs(lastUpdateRef.current - progress.playedSeconds);
      if (timeDiff > 5) {
        onStateChange({
          ...videoState,
          action: 'PROGRESS',
          progress
        });
        lastUpdateRef.current = progress.playedSeconds;
      }
    }
  };

  const handleSeeked = ({ timeStamp }) => {
    if (isHost) {
      // onStateChange({
      //   ...videoState,
      //   action: 'SEEKED',
      //   timestamp: timeStamp,
      // });
    }
  };

  return (
    <div>
      <div className="watch-party-video-player">
        <div className="player-wrapper">
          <ReactPlayer
            ref={playerRef}
            url={`${videoState?.movie?.videoUrl}`}
            className="react-player"
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            onSeeked={handleSeeked}
            progressInterval={500}
            controls={isHost}
            playing={videoState.playing}
          />
        </div>
      </div>
    </div>
  );
}

WatchPartyVideoPlayer.propTypes = {
  videoState: PropTypes.object.isRequired,
  onStateChange: PropTypes.func.isRequired,
  isHost: PropTypes.bool.isRequired,
};
