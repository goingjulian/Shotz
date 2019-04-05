import environment from "../environments/environment";
import { store } from "..";
import { getTeamList, rejectTeamAction } from "../actions/teamActions";

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
            dispatch(handleMessage(parsedMessage));
        };

        socket.onclose = () => {
            console.log("Socket disconnected");

            if (reconnects < 3) {
                console.log("Trying to reconnect");
                reconnects++;
                setTimeout(() => {
                    dispatch(initSocket());
                }, 5000);
            } else {
                // throw new Error("Socket connection could not be restored");
            }
        };
    };
}

function handleMessage(message) {
    console.log("WEBSOCKET MESSAGE:");
    console.log(message);
    console.log("---------");
    return dispatch => {
        switch (message.type) {
            case "quizmaster_newTeam":
                const roomKey = store.getState().room.roomKey;
                dispatch(getTeamList(roomKey));
                break;
            case "quizmaster_teamLeft":
                dispatch(rejectTeamAction(message.sessionId));
                break;
            default:
                console.log("Unknown message: ", message);
        }
    };
}
