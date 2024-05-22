import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [userpwd, setUserpwd] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  //const [image, setImage] = useState(null);
  let websocket;

  const connectWebSocket = () => {
    websocket = new WebSocket("ws://192.168.101.81:8080/ws/chat");
    websocket.onmessage = onMessage;
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
  };

  const onClose = (evt) => {
    const str = username + ": 님이 방을 나가셨습니다.";
    websocket.send(str);
  };

  const onOpen = (evt) => {
    const str = username + ": 님이 입장하셨습니다.";
    websocket.send(str);
  };

  const onMessage = (msg) => {
    const data = msg.data;
    const arr = data.split(":");
    const sessionId = arr[0];
    const message = arr[1];

    if (sessionId === username) {
      setMessages([...messages, { sessionId, message, type: 'sent' }]);
    } else {
      setMessages([...messages, { sessionId, message, type: 'received' }]);
    }
  };

  const handleLogin = () => {
    if (username && userpwd) {
      fetch('http://192.168.101.81:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, userpwd }),
      })
        .then(response => response.json())
        .then(() => {
          setLoggedIn(true);
          connectWebSocket();
        })
        .catch(error => alert("Error registering user: " + error));
    } else {
      alert("Username and Password are required.");
    }
  };

  const handleSend = () => {
    let messageToSend = msg.trim(); // trim 메서드를 사용하여 공백을 제거합니다.
    if (messageToSend) {
      send(messageToSend);
    } else {
      alert("Please enter a message to send.");
    }
  };

  const send = (message) => {
    websocket.send(username + ":" + message);
    setMsg('');
  };

  const formatMessage = (message) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return message.split(urlPattern).map((part, index) => {
      if (urlPattern.test(part)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
      }
      return part;
    });
  };

  return (
    <div className="container">
      <div className="col-6">
        <label><b>채팅방</b></label>
      </div>
      <div>
        {!loggedIn ? (
          <div id="loginArea" className="col">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Enter Username"
            />
            <input
              type="password"
              value={userpwd}
              onChange={(e) => setUserpwd(e.target.value)}
              className="form-control"
              placeholder="Enter Password"
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        ) : (
          <div id="chatArea" className="col">
            <div id="msgArea" className="col">
              {messages.map((message, index) => (
                <div key={index} className={`col-6 alert alert-${message.type}`}>
                  <b>{message.sessionId} : {formatMessage(message.message)}</b>
                </div>
              ))}
            </div>
            <div className="col-6">
              <div className="input-group mb-3">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="form-control"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-send"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
            {/*
            <div className="col-6">
              <div className="input-group mb-3">
                <form id="uploadForm" encType="multipart/form-data">
                  <input
                    type="file"
                    id="imageInput"
                    name="image"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      id="button-upload"
                      onClick={handleSend}
                    >
                      Upload File
                    </button>
                  </div>
                </form>
              </div>
            </div>
            */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
