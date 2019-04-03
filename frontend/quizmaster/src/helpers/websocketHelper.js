import environment from '../environments/environment'
import { addTeam } from '../actions/lobbyActions'

//https://gist.github.com/dmichael/9dc767fca93624df58b423d01e485402

let reconnects = 0

export function initSocket() {
    console.log("Connecting to socket")
    return async dispatch => {

        const socket = await new WebSocket(`ws://${environment.baseUrl}/ws`)

        socket.onopen = () => {
            console.log("socket connected")
            reconnects = 0
        }

        socket.onmessage = (eventInfo) => {
            const parsedMessage = JSON.parse(eventInfo.data)
            handleMessage(parsedMessage, dispatch)
        }

        socket.onclose = () => {
            console.log("Socket disconnected")

            if (reconnects < 3) {
                console.log("Trying reconnect")
                reconnects++
                setTimeout(() => {
                    dispatch(initSocket())
                }, 5000)
            } else {
                throw new Error("Socket connection could not be restored")
            }
        }





    }
}

function handleMessage(message, dispatch) {
    console.log("websocket message received ", message)

    if (message.type) {
        switch (message.type) {
            case "addTeam":
                console.log("Adding a team")
                dispatch(addTeam(message.id, message.name))
                break;
            default:
                console.log("Unknown messageType: ", message);
        }
    } else {
        console.log("Unknown message: ", message);
    }
}