import React, { useState, useEffect } from 'react'; //리엑트와 유즈 스테이트,이펙트를를 사용하기위해 리엑트에서 임포트한다. 
import './index.css'; //css에서 임포트한다

function App() {
  const [username, setUsername] = useState(''); //상태를 관리하기위해(username은 현재 상태, setUsername은 상태를 업데이트 하기 위해 useState에 저장해줍니다) 
  const [userpwd, setUserpwd] = useState(''); //위와 같은 내용(pw의 현재상태, pw의 상태를 알기 위해)
  const [loggedIn, setLoggedIn] = useState(false); //로그인을 했는지 확인하고 로그인을 했다면 useState가 true로 업데이트 하기 위해(기본값은 false)
  const [msg, setMsg] = useState(''); //사용자가 입력한 메세지를 저장하니다
  const [messages, setMessages] = useState([]); //채팅방에 있는 모든 메시지를 저장합니ㅏ
  let websocket; //웹소켓이 필요한 곳에 좀 더 간편하게 사용하기 위해 함수화 시켰습니다

  /*
    위의 배열들은 채팅앱의 상태를 관리를 쉽게 할 수 있도록 선언 한 것 입니다.
  */

  useEffect(() => {
    if (loggedIn) { //로그인을 하게 되면 웹 소켓에 연결 허도록 설정한 코드입니다
      connectWebSocket();
    }
  }, [loggedIn]);

  const connectWebSocket = () => {
    websocket = new WebSocket("ws://192.168.101.81:8080/ws/chat");
    websocket.onmessage = onMessage; //메시지 수신될 때 호출되는 함수
    websocket.onclose = onClose; //연결이 종료되었을때 호출되는 함수

    //웹소켓의 연결을 설정해주는 코드입니다. 웹 websocket은 주소를 설정합니다

  };

  const onClose = () => {
    const str = username + ": 님이 방을 나가셨습니다.";
    websocket.send(str);

    //상대방의 연결이 끊겼을때 상대방의 이름 + 님이 나가셨습니다로 상대방과 연결이 끊겼다는 것을 알려줍니다
  };

  const onMessage = (event) => { //메세지가 전송될 때
    const data = event.data; //data 변수안에 메세지 데이터가 서버로 전송된다
    const arr = data.split(":"); //콜론을 기준으로 구분하여 배열에 저장한다
    const sessionId = arr[0]; //분리 후 첫번째 요소는 sessionID로 배열에 저장됨
    const message = arr[1]; //분리 후 두번째 요소는 message로 배열에 저장됨

    setMessages(prevMessages => [...prevMessages, { sessionId, message }]);
    /*
    setMessages는 상태 업데이트 함수(prevMessages는 현재 메시지 목록),
    [...prevMessages로 빈 배열을 생성 후 sessionId, message를 추가해 배열을 구성]
    */
  };

  const handleLogin = () => { //로그인 했을 시 발생
    if (username && userpwd) { //username과 userpwd가 모두 입력 되었을 시
      fetch('http://192.168.101.81:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, userpwd }),
        /*
        fetch API를 사용하여 서버에 POST방식으로 요청을 보냄
        Content-Type을 application/json 으로 설정하여 JSON 데이터를 전송함
        //body에 username, userpwd는 JSON형식으로 변환되어 포함
        */
      })
        .then(response => response.json())
        .then(() => {
          setLoggedIn(true);
        })
        .catch(error => alert("Error registering user: " + error));
        /* 
        서버로부터 응답을 받으면 json 형식으로 변환합니다.
        응답이 문제가 없으면 로그인이 true로 변경되며, 입력한 정보를 바탕으로 설정하고 채팅방으로 이동합니다
        .catch는 요청 도중 에러가 발생하면 경고 메시지를 표시해줍니다
        */
    } else {
      alert("Username and Password are required.");
      //사용자 이름이나 비밀번호가 입력되지 않았을 경우 알림창을 띄웁니다
    }

  };

  const handleSend = () => {
    let messageToSend = msg.trim(); //사용자가 입력한 메세지의 공백을 제거
    if (messageToSend) {
      websocket.send(username + ":" + messageToSend);
      setMsg('');
      //사용자가 메세지를 입력한 경우 웹 소켓을 사용하여 서버에 메시지를 보낸다. 
      //메세지는 사용자 이름과 함께 보내지고 setMsg를 사용하여 입력한 메시지를 비운다 
    } else {
      alert("Please enter a message to send.");
    }
    //메세지가 없을 경우 alert창을 띄워 메세지 내용이 없다고 알려줍니다
  };

  return (
    <div className="container"/**/>
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
