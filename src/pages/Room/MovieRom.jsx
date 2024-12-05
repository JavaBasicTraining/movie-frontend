import React from 'react';
import Chat from './Chat/Chat';
import './MovieRoom.scss';
import { useLoaderData } from 'react-router-dom';
import VideoPlayer from '../../component/VideoPlayer';
const MovieRom = () => {
  const { movie } = useLoaderData();

  return (
    <div className="movie-room">
      <h1>Movie Room</h1>
      <div className='btn-invite'>
        <button>+</button>
      </div>
      <VideoPlayer fileName={movie.videoUrl} controls />

      <div>
        <Chat />
      </div>
    </div>
  );
};

export default MovieRom;
