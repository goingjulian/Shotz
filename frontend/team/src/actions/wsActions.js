import environment from "../environments/environment";
import { teamAcceptedAction, teamRejectedAction, leaveGameAction } from "./gameActions";
import { viewLobbyAction } from "./viewActions";

let reconnects = 0;

export function initSocket() {
    console.log("Connecting to socket");
    return async dispatch => {
        const socket = await new WebSocket(`${environment.WS_URL}/ws`);

        socket.onopen = () => {
            console.log("Websocket connected");
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
                console.log("Websocket connection could not be restored");
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
            case "team_accepted":
                dispatch(teamAcceptedAction());
                break;
            case "team_rejected":
                dispatch(teamRejectedAction());
                break;
            case "team_quizmasterLeft":
                dispatch(viewLobbyAction());
                dispatch(leaveGameAction());
                break;
            default:
                console.log("Unknown message: ", message);
        }
    };
}
