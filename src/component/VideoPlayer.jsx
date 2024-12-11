import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { axiosInstance } from '../configs/axiosConfig';

export const VideoPlayer = ({ fileName }) => {
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
          `/api/v1/minio/video/token?fileName=${fileName}`
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
      <div
        className="video-player-container"
        onContextMenu={(e) => e.preventDefault()}
        style={{ position: 'relative' }}
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
            config={{
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
            }}
          />
        )}

        <div
          ref={watermarkRef}
          className="video-watermark"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            padding: '5px',
            background: 'rgba(255, 255, 255, 0.3)',
            color: '#fff',
            pointerEvents: 'none',
            transition: 'transform 1s ease',
            userSelect: 'none',
          }}
        >
          {`${localStorage.getItem('username')} - ${new Date().toLocaleString()}`}
        </div>
      </div>

      <style jsx>{`
        .video-player-wrapper {
          position: relative;
          max-width: 100%;
          background: #000;
        }

        .video-player-container {
          width: 100%;
          height: 100%;
        }

        /* Disable selection */
        .video-player-container * {
          user-select: none !important;
        }
      `}</style>
    </div>
  );
};
