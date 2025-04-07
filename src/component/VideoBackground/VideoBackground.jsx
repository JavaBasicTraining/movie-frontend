import React, { useEffect, useRef } from 'react';
import './VideoBackground.scss';

export const VideoBackground = (props) => {
  const { url } = props;
  const videoRef = useRef(null);

  useEffect(() => {
    handlePlay();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.muted = false;
    }
  };

  return (
    <>
      {url && (
        <div className="VideoBackground">
          <div className='overlay'></div>
          <video
            ref={videoRef}
            src={url}
            controls={false}
            autoPlay={true}
            muted="muted"
          ></video>
          {/*<button onClick={handlePlay}></button>*/}
        </div>
      )}
    </>
  );
};
