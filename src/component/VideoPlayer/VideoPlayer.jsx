import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.scss';
import { videoService } from '../../services';
import { axiosInstance } from '../../configs';

export const VideoPlayer = ({ fileName }) => {
  const [playing] = useState(false);
  const [volume] = useState(0.8);
  const [videoUrl, setVideoUrl] = useState();
  const playerRef = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await videoService.generateToken(fileName);
        const url = response.data.token
          ? `${axiosInstance.defaults.baseURL}/api/v1/minio/video/stream?fileName=${fileName}&token=${response.data.token}`
          : null;
        setVideoUrl(url);
      } catch (error) {
        console.error('Error fetching video token:', error);
      }
    };

    fetchToken().then();

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

  return (
    <div className="VideoPlayer">
      <div
        className="VideoPlayer__container"
        onContextMenu={(e) => e.preventDefault()}
      >
        {videoUrl && (
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
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

        <div ref={watermarkRef} className="VideoPlayer__watermark">
          {`${localStorage.getItem('username')} - ${new Date().toLocaleString()}`}
        </div>
      </div>
    </div>
  );
};