import environment from '../environments/environment'
import { addTeam } from '../actions/lobbyActions'
import { addMultipleTeams } from '../actions/lobbyActions'
import { lobbyViewAction } from '../actions/viewActions'
import { createRoomAction } from '../actions/roomActions'

//https://gist.github.com/dmichael/9dc767fca93624df58b423d01e485402

export function initSocket() {
    return async dispatch => {
        const socket = await new WebSocket(`ws://${environment.baseUrl}/ws`)

        socket.onopen = () => console.log("socket connected")

        socket.onmessage = (eventInfo) => {
            const parsedMessage = JSON.parse(eventInfo.data)
            handleMessage(parsedMessage, dispatch)
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
                break
            case "gameState":
                console.log("state received")
                console.log(message);
                dispatch(addMultipleTeams(message.teams));
                dispatch(createRoomAction(message.roomKey))
                dispatch(lobbyViewAction())
            break;
            default:
            console.log("Unknown messageType: ", message);
        }
    } else {
        console.log("Unknown message: ", message);
    }
}