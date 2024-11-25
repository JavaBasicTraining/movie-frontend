import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { axiosInstance } from '../../API/axiosConfig';
import PropTypes from 'prop-types';
import './VideoPlayer.scss';

const REACT_PLAYER_CONFIG = {
  file: {
    attributes: {
      controlsList: 'nodownload noremoteplayback',
      disablePictureInPicture: true,
      crossOrigin: 'anonymous',
    },
    forceVideo: true,
    forceHLS: false,
    forceDASH: false,
    headers: {
      Range: 'bytes=0-',
    },
  },
};

const VideoPlayer = ({ fileName }) => {
  const [videoToken, setVideoToken] = useState(null);
  const [playing] = useState(false);
  const [volume] = useState(0.8);
  const playerRef = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    // Fetch video token
    const fetchToken = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/minio/video/token?fileName=${fileName}`,
        );
        setVideoToken(response.data.token);
      } catch (error) {
        console.error('Error fetching video token:', error);
      }
    };

    fetchToken();

    // Update watermark position randomly
    const intervalId = setInterval(() => {
      if (watermarkRef.current) {
        const x = Math.random() * 60;
        const y = Math.random() * 60;
        watermarkRef.current.style.transform = `translate(${x}%, ${y}%)`;
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fileName]);

  const videoUrl = videoToken
    ? `http://localhost:8081/api/v1/minio/video/stream?fileName=${fileName}&token=${videoToken}`
    : null;

  return (
    <div className="video-player-wrapper">
      <button
        className="video-player-container btn-non-style"
        onContextMenu={(e) => e.preventDefault()}
      >
        {videoUrl && (
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="auto"
            playing={playing}
            volume={volume}
            controls={true}
            config={REACT_PLAYER_CONFIG}
          />
        )}

        <div
          ref={watermarkRef}
          className="video-watermark"
        >
          {`${localStorage.getItem('username')} - ${new Date().toLocaleString()}`}
        </div>
      </button>
    </div>
  );
};

VideoPlayer.propTypes = {
  fileName: PropTypes.string.isRequired,
};

export default VideoPlayer;
