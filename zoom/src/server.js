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
    socket.on(
        "enter_room",
        (msg, done) => {
            console.log(msg)
            setTimeout(() => {
                done("Hello I'm from backend")
            }, 3000)
        }
    )
})

httpServer.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`))