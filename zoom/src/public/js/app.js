const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")
const room = document.getElementById("room")

room.hidden = true

let roomName;

const addMessage = (message) => {
    const ul = room.querySelector("ul")
    const li = document.createElement("li")
    li.textContent = message
    ul.appendChild(li)
}

const handleMessageSubmit = (event) => {
    event.preventDefault()
    const input = room.querySelector("#msg input")
    const { value } = input
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    })
    input.value = ""
}
const handleNicknameSubmit = (event) => {
    event.preventDefault()
    const input = room.querySelector("#nickname input")
    const { value } = input
    socket.emit("nickname", value);
    input.value = ""
}
const showRoom = () => {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector("h3")
    h3.textContent = `Room ${roomName}`

    const messageForm = room.querySelector('#msg')
    const nicknameForm = room.querySelector('#nickname')
    messageForm.addEventListener("submit", handleMessageSubmit)
    nicknameForm.addEventListener("submit", handleNicknameSubmit)
}

const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = form.querySelector("input")
    socket.emit("enter_room", input.value, showRoom)
    roomName = input.value;
    input.value = ""
}
form.addEventListener("submit", handleRoomSubmit)

socket.on("welcome", (nickname, newCount) => {
    const h3 = room.querySelector("h3")
    h3.textContent = `Room ${roomName} (${newCount})`
    addMessage(`${nickname} joined!`)
})

socket.on("bye", (nickname, newCount) => {
    const h3 = room.querySelector("h3")
    h3.textContent = `Room ${roomName} (${newCount})`
    addMessage(`${nickname} left!`)
})

socket.on("new_message", addMessage)
/*
socket.on("new_message",(msg)=>{
    addMessage(msg)
})
*/

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul")
    roomList.innerHTML = ""
    if (rooms.length === 0) return;
    rooms.forEach(room => {
        const li = document.createElement("li")
        li.textContent = room;
        roomList.appendChild(li)
    })
});