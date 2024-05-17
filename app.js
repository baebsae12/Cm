const express = require("express");
const mysql = require("mysql2");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");
const moment = require("moment");

const pool = require('mysql').createPool({
    host: "localhost",
    user: "root", 
    password: "root", 
    database: "subBox" 
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
const PORT = process.env.PORT || 8080;

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
