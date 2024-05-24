import React, { useState, useEffect } from 'react'; //리엑트와 유즈 스테이트,이펙트를를 사용하기위해 리엑트에서 임포트한다. 
import './index.css'; //css에서 임포트한다

function App() {
  const [username, setUsername] = useState('');//상태를 관리하기위해(username은 현재 상태, setUsername은 상태를 업데이트 하기 위해 useState에 저장해줍니다) 
  const [userpwd, setUserpwd] = useState('');//위와 같은 내용(pw의 현재상태, pw의 상태를 알기 위해)
  const [loggedIn, setLoggedIn] = useState(false);//로그인을 했는지 확인하고 로그인을 했다면 useState가 true로 업데이트 하기 위해(기본값은 false)
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  let websocket;

  /*
    
  */

  useEffect(() => {
    if (loggedIn) {
      connectWebSocket();
    }
  }, [loggedIn]);

  const connectWebSocket = () => {
    websocket = new WebSocket("ws://192.168.101.81:8080/ws/chat");
    websocket.onmessage = onMessage;
    websocket.onclose = onClose;
  };

  const onClose = () => {
    const str = username + ": 님이 방을 나가셨습니다.";
    websocket.send(str);
  };

  const onMessage = (event) => {
    const data = event.data;
    const arr = data.split(":");
    const sessionId = arr[0];
    const message = arr[1];

    setMessages(prevMessages => [...prevMessages, { sessionId, message }]);
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
        })
        .catch(error => alert("Error registering user: " + error));
    } else {
      alert("Username and Password are required.");
    }
  };

  const handleSend = () => {
    let messageToSend = msg.trim();
    if (messageToSend) {
      websocket.send(username + ":" + messageToSend);
      setMsg('');
    } else {
      alert("Please enter a message to send.");
    }
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
                <div key={index} className="col-6 alert alert-info">
                  <b>{message.sessionId} : {message.message}</b>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
