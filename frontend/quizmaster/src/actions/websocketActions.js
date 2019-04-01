import environment from '../environments/environment'

let socket

export async function initSocket() {
    if (!socket) {
        console.log("Opening socket")
        const socket = await new WebSocket(`ws://${environment.baseUrl}/ws`)
        socket.onmessage = messageReceived
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
}