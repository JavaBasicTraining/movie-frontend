import { axiosInstance } from "../configs/axiosConfig";

class RoomService {
  getRoomInfo(roomId) {
    return axiosInstance.get(`/api/v1/rooms/${roomId}`);
  }

  createRoom(room) {
    return axiosInstance.post('/api/v1/rooms', room);
  }
}

export const roomService = new RoomService();
