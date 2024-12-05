import { socketService } from './socketService';

export const setupWebRTC = ({ isHost, roomId, onTrack, onIceCandidate }) => {
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com:3478',
        username: 'username',
        credential: 'password',
      },
    ],
  };

  const pc = new RTCPeerConnection(configuration);

  // Xử lý ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socketService.send(`/app/room/${roomId}/ice-candidate`, {
        candidate: event.candidate,
        userId: isHost ? 'host' : 'viewer',
      });
    }
  };

  // Xử lý remote tracks
  pc.ontrack = (event) => {
    onTrack?.(event.streams[0]);
  };

  // Xử lý kết nối với SFU
  const connectToSFU = async (localStream) => {
    try {
      // Thêm local tracks vào peer connection
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      if (isHost) {
        // Host tạo offer
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        socketService.send(`/app/room/${roomId}/webrtc-offer`, {
          offer: pc.localDescription,
          userId: 'host',
        });
      } else {
        // Viewer lắng nghe offer từ SFU
        socketService.subscribe(
          `/topic/room/${roomId}/webrtc-offer`,
          async (data) => {
            await pc.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketService.send(`/app/room/${roomId}/webrtc-answer`, {
              answer: pc.localDescription,
              userId: 'viewer',
            });
          }
        );
      }

      // Xử lý ICE candidates từ SFU
      socketService.subscribe(
        `/topic/room/${roomId}/ice-candidate`,
        async (data) => {
          try {
            if (data.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
          } catch (error) {
            console.error('Error adding received ice candidate', error);
          }
        }
      );
    } catch (error) {
      console.error('Error connecting to SFU:', error);
    }
  };

  // Xử lý negotiation needed
  pc.onnegotiationneeded = async () => {
    try {
      if (isHost) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketService.send(`/app/room/${roomId}/webrtc-offer`, {
          offer: pc.localDescription,
          userId: 'host',
        });
      }
    } catch (error) {
      console.error('Error during negotiation:', error);
    }
  };

  return {
    peerConnection: pc,
    connectToSFU,
  };
};
