import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../API/axiosConfig';

const VideoPlayer = ({ fileName }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const params = new URLSearchParams({ fileName });
        const response = await axiosInstance.get('http://localhost:8081/api/upload/video', {
          params: params,
          responseType: 'blob',  
        });

        // Tạo URL từ blob và cập nhật vào videoUrl
        const url = URL.createObjectURL(response.data);
        setVideoUrl(url);
      } catch (error) {
        console.error('Error fetching video', error);
      }
    };

    fetchVideo(); 

    // Cleanup URL khi component unmount
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [fileName]);

  return (
    <div>
      <h1>Video Player</h1>
      {videoUrl ? (
        <video controls width="800">
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
