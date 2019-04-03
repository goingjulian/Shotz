import environment from "../environments/environment";
import { store } from "..";
import { getTeamList } from "../actions/teamActions";

//https://gist.github.com/dmichael/9dc767fca93624df58b423d01e485402

let reconnects = 0;

export function initSocket() {
    console.log("Connecting to socket");
    return async dispatch => {
        const socket = await new WebSocket(`${environment.WS_URL}/ws`);

        socket.onopen = () => {
            console.log("socket connected");
            reconnects = 0;
        };

        socket.onmessage = eventInfo => {
            const parsedMessage = JSON.parse(eventInfo.data);
            console.log(parsedMessage);
            dispatch(handleMessage(parsedMessage));
        };

        socket.onclose = () => {
            console.log("Socket disconnected");

            if (reconnects < 3) {
                console.log("Trying reconnect");
                reconnects++;
                setTimeout(() => {
                    dispatch(initSocket());
                }, 5000);
            } else {
                throw new Error("Socket connection could not be restored");
            }
        };
    };
}

function handleMessage(message) {
    console.log(message);
    return dispatch => {
        switch (message.type) {
            case "quizmaster_newTeam":
                const roomKey = store.getState().room.roomKey;
                console.log(roomKey);
                dispatch(getTeamList(roomKey));
                break;
            default:
                console.log("Unknown message: ", message);
        }
    };
}
