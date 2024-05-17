const express = require("express");
const mysql = require("mysql");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");
const moment = require("moment");

// MySQL 커넥션 풀 생성
const pool = mysql.createPool({
    connectionLimit: 10, // 동시에 유지할 수 있는 최대 연결 수
    host: "localhost",
    user: "Cm",
    password: "1234",
    port: 3306,
    database: "users"
});

// MySQL 커넥션 풀 연결
pool.getConnection((err, connection) => {
    if (err) {
        console.error("DB 연결 오류:", err);
        return;
    }
    console.log("DB 연결 완료");

    // 연결 종료
    connection.release();
});

const io = socketIO(server);

app.use(express.static(path.join(__dirname, "src")));
const PORT = process.env.PORT || 3306;

io.on("connection", (socket) => {
    socket.on("chatting", (data) => {
        const { name, msg } = data;

        io.emit("chatting", {
            name: name,
            msg: msg,
            time: moment().format("h:mm A")
        });
    });
});

server.listen(PORT, () => console.log(`server is running ${PORT}`));
