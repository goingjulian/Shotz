import environment from "../environments/environment";
import { initSocket } from "../helpers/websocketHelper";
import { setViewByGameState, loginViewAction } from "./viewActions";
import { removeTeamsAction, setTeamsAction } from "./teamActions";
import { setRoundsAction } from "./roundsActions";

export const roomActionTypes = {
    CREATE_ROOM: "CREATE_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM"
};

export function createRoomAction(roomKey) {
    return {
        type: roomActionTypes.CREATE_ROOM,
        roomKey: roomKey
    };
}

export function leaveRoomAction() {
    return {
        type: roomActionTypes.LEAVE_ROOM
    };
}

export function createRoom() {
    return async dispatch => {
        try {
            const response = await fetch(`${environment.API_URL}/room`, {
                credentials: "include",
                mode: "cors",
                method: "post"
            });
            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.error);
            } else {
                dispatch(createRoomAction(body.roomKey));
                dispatch(setViewByGameState(body.gameState));
                dispatch(initSocket());
            }
        } catch (err) {
            console.log(err.message);
        }
    };
}

export function leaveRoom(roomKey) {
    const method = {
        method: "DELETE",
        credentials: "include"
    };
    return dispatch => {
        fetch(`${environment.API_URL}/room/${roomKey}/leave`, method)
            .then(async response => {
                const body = await response.json();
                console.log("LEAVE ROOM");
                console.log(body);
                console.log("----------");
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    dispatch(leaveRoomAction());
                    dispatch(removeTeamsAction());
                    dispatch(loginViewAction());
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
}

export function restoreSession() {
    return async dispatch => {
        try {
            const response = await fetch(`${environment.API_URL}/room/restore`, {
                credentials: "include",
                mode: "cors",
                method: "post",
                body: JSON.stringify({ role: "Quizmaster" }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const body = await response.json();

            if (!response.ok) {
                throw new Error(body.error);
            } else {
                console.log(body);
                dispatch(setTeamsAction(body.teams));
                dispatch(createRoomAction(body.roomKey));
                dispatch(setRoundsAction(body.rounds, body.currentQuestionIndex));
                dispatch(setViewByGameState(body.gameState));
                dispatch(initSocket());
            }
        } catch (err) {
            console.log(err.message);
        }
    };
}
