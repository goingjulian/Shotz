import environment from "../environments/environment";
import { teamAcceptedAction, teamRejectedAction } from "./gameActions";

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
    return dispatch => {
        switch (message.type) {
            case "team_accepted":
                dispatch(teamAcceptedAction());
                break;
            case "team_rejected":
                dispatch(teamRejectedAction());
                break;
            default:
                console.log("Unknown message: ", message);
        }
    };
}
