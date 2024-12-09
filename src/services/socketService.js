import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class SocketService {
  _connected = false;

  get connected() {
    return this._connected;
  }

  constructor() {
    this.client = null;
    this.subscriptions = new Map();
  }

  connect(onConnect) {
    const socket = new SockJS(`${process.env.REACT_APP_SOCKET_URL}`);

    this.client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      if (onConnect) onConnect();
      this._connected = true;
    };

    this.client.activate();
  }

  subscribe(destination, callback) {
    if (!this.client?.connected) {
      throw new Error('Socket not connected');
    }

    const subscription = this.client.subscribe(destination, (message) => {
      const payload = JSON.parse(message.body);
      callback(payload);
    });

    this.subscriptions.set(destination, subscription);
  }

  send(destination, message) {
    if (!this.client?.connected) {
      throw new Error('Socket not connected');
    }
    this.client.publish({
      destination,
      body: JSON.stringify(message),
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this._connected = false;
    }
  }
}
export const socketService = new SocketService();
