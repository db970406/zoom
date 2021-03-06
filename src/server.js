import "dotenv/config"
import express from "express"
import http from "http"
import WebSocket from 'ws'

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
const wss = new WebSocket.Server({ server: httpServer })


const sockets = []

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous"
    console.log("Connected to Browser")
    socket.on("close", () => console.log("Disconnected from Browser"))
    socket.on("message", (msg) => {
        const message = JSON.parse(msg)
        switch (message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`))
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }

    })
})

httpServer.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`))