import environment from "../environments/environment";
import { viewWaitingscreenAction, restoreActiveScreenFromGameState } from "./viewActions";

export function joinRoomAction(gameState) {
    return {
        type: "player_joinRoom",
        roomKey: gameState.roomKey,
        teamName: gameState.teamName
    };
}

export function restoreSessionAction(gameState) {
    return {
        type: "player_restoreSession",
        roomKey: gameState.roomKey,
        teamName: gameState.teamName,
        accepted: gameState.accepted
    };
}

export function joinRoom(roomKey, teamName) {
    const body = {
        teamName: teamName
    };
    const method = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
    return dispatch => {
        fetch(`${environment.API_URL}/room/${roomKey}`, method)
            .then(async response => {
                if (!response.ok) {
                    const body = await response.body();
                    throw new Error(body.error);
                } else {
                    dispatch(joinRoomAction(body));
                    dispatch(viewWaitingscreenAction());
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
}

export function restoreSession() {
    const method = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: "Team" })
    };
    return dispatch => {
        fetch(`${environment.API_URL}/room/restore`, method)
            .then(async response => {
                const body = await response.json();
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    dispatch(restoreSessionAction(body));
                    dispatch(restoreActiveScreenFromGameState(body.gameState));
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
}
