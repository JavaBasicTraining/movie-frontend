import { socketService } from "./socketService";

export const setupWebRTC = ({ isHost, roomId, onIceCandidate }) => {
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
    ],
  };

  const pc = new RTCPeerConnection(configuration);
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  if (isHost) {
    // Host creates an offer
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => {
        // Send offer to signaling server (socket)
        socketService.send(`/app/room/${roomId}/webrtc-offer`, {
          offer: pc.localDescription,
        });
      });
  } else {
    // Viewer listens to offer and sends answer
    socketService.subscribe(`/topic/room/${roomId}/webrtc-offer`, async (data) => {
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socketService.send(`/app/room/${roomId}/webrtc-answer`, {
        answer: pc.localDescription,
      });
    });
  }

  return pc;
}; 