import React, { useEffect, useState } from 'react';
import Chat from './Chat/Chat';
import './MovieRoom.scss';
import { useLoaderData, useNavigate } from 'react-router-dom';
import VideoPlayer from '../../component/VideoPlayer';
import { notification } from 'antd';
import useWebSocket from '../../hooks/useWebSocket';
import useFetchUser from '../../hooks/useFetchUser';
import { axiosInstance } from '../../configs/axiosConfig';

const MovieRoom = () => {
  const { user } = useFetchUser();
  const { movie } = useLoaderData();
  const { lastMessage, isConnected, sendMessage } = useWebSocket();
  const [room, setRoom] = useState(null);
  const navigate = useNavigate(); // Sửa đây, dùng `navigate` thay vì `navigator`

  const getRoom = async (params) => {
    try {
      const response = await axiosInstance.get(`/api/v1/room-chat/filter/${params}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    }
  };

  useEffect(() => {
    if (user?.userName) {
      getRoom(user.userName);
    }
  }, [user]);

  const handleCopy = () => {
    const inputValue = `http://localhost:3000/room/${movie.id}`;
    navigator.clipboard
      .writeText(inputValue)
      .then(() => {
        notification.success({
          message: 'Đã sao chép link room',
          description: 'Link phòng đã được sao chép.',
        });
      })
      .catch((err) => {
        notification.error({
          message: 'Lỗi khi sao chép link room',
          description: err.message || 'Không thể sao chép link phòng.',
        });
      });
  };

  const deleteRoom = async (params) => {
    try {
      if (room.roomName === user.userName) {
        const response = await axiosInstance.delete(`/api/v1/room-chat/${params}`);
        return response.data;
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await deleteRoom(room?.id);
      notification.success({
        message: 'Rời phòng thành công',
        description: 'Bạn đã rời khỏi phòng chat.',
      });
      setRoom(null); // Xóa thông tin phòng
    } catch (error) {
      notification.error({
        message: 'Lỗi khi rời phòng',
        description: error.message || 'Không thể rời phòng.',
      });
    }
  };

  return (
    <div className="movie-room">
      <h1>Movie Room</h1>
      <div className="btn-invite">
        <button onClick={handleCopy}>+</button>
        <button onClick={() => { handleLeaveRoom(); navigate("/"); }}>
          Rời Phòng
        </button>
      </div>
      <VideoPlayer fileName={movie.videoUrl} controls />
      <div>
        <Chat />
      </div>
    </div>
  );
};

export default MovieRoom;
