import "dotenv/config"
import express from "express"
import http from "http"
//import WebSocket from 'ws'
import SocketIO from "socket.io"

const app = express()

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")

app.use("/public", express.static(__dirname + "/public"))

const home = (req, res) => res.render("home")
app.get("/", home)
app.get("/*", (req, res) => res.redirect("/"))
// 어떤 주소로 가든 home으로 보내버린다.

const PORT = process.env.PORT

const httpServer = http.createServer(app)
const wsServer = SocketIO(httpServer)


wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anonymous"

    socket.on("enter_room", (roomName, showRoom) => {
        socket.join(roomName)
        showRoom();
        socket.to(roomName).emit("welcome", socket.nickname);
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname))
    })
    socket.on("new_message", (msg, roomName, done) => {
        socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
        done()
    })
    socket.on("nickname", (nickname) => {
        socket.nickname = nickname
    })
})

httpServer.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`))