import React, { useEffect, useState } from "react";
import useWebSocket from "../../../hooks/useWebSocket";
import "./Chat.scss";
import { axiosInstance } from '../../../configs/axiosConfig';
import { useLoaderData } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { lastMessage, isConnected, sendMessage } = useWebSocket();

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e.preventDefault());
    }
  };
  const handleSendMessage = (e) => {
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const fetchMessage = async ()=>
  {
    const response = await axiosInstance.get(`http://localhost:8081/message/getAll`)
    setMessages(response.data)
  }

  useEffect(() => {
    fetchMessage();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, lastMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    }
  }, [lastMessage]);

  return (
    <div className="chat">
    
      <div className="chat__container">
        {messages.length === 0 ? (
          <p>Chưa có tin nhắn</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index}>
              <strong>ID:</strong> {msg.id} <br />
              <strong>Message:</strong> {msg.messageText}
            </p>
          ))
        )}
      </div>

      <div className="chat__input-send">
        <input
          type="text"
          onKeyDown={handleKeyDown}
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Nhập tin nhắn"
        />
        <button onClick={handleSendMessage}>Gửi</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <h2>Trạng thái kết nối: {isConnected ? "Đã kết nối" : "Chưa kết nối"}</h2>
    </div>
  );
};

export default Chat;
