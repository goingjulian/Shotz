import environment from '../environments/environment'
import { addTeam } from '../actions/lobbyActions'

let socket

export async function initSocket() {
    if (!socket) {
        console.log("Opening socket")
        const socket = await new WebSocket(`ws://${environment.baseUrl}/ws`)
        socket.onmessage = messageReceived
        socket.onopen = socketConnected
    }
}

export function getSocket() {
    if (socket) {
        return socket
    } else {
        throw new Error("The socket has not been opened yet")
    }
}

function messageReceived(message) {
    console.log("websocket message received ", message)
    console.log(typeof message)
    if (message.type) {
        switch (message.type) {
            case "test":
                addTeam(message.id, message.name)
                break
        }
    }

    
}

function socketConnected() {
    console.log("socket connected")
    this.send("Hello server")
}