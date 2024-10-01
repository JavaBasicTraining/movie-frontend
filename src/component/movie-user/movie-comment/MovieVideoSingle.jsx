import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../../API/axiosConfig';
import { useLoaderData } from 'react-router-dom';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { Comment } from './Comment';

export async function filterMovieLoader({ params }) {
  const response = await axiosInstance.get(`/api/v1/movies/${params.id}`);
  return { movie: response.data };
}

export const MovieVideo = () => {

  const { movie } = useLoaderData();




  return (
    <div className="container-movie">
      <div className="header-container">
        <div className="header">
          <video src={movie.videoUrl} controls />
        </div>
        <div className="like-share">
          <button>
            <LikeOutlined />
          </button>
          <button>
            <ShareAltOutlined />
          </button>
        </div>
      </div>

      <div className="body">
      <Comment movieId={movie.id} />
      </div>
    </div>
  );
};