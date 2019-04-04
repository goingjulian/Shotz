import environment from "../environments/environment";
import { viewWaitingscreenAction, restoreActiveScreenFromGameState } from "./viewActions";
import { initSocket } from "./wsActions";

export function joinRoomAction(gameState) {
    return {
        type: "team_joinRoom",
        roomKey: gameState.roomKey,
        teamName: gameState.teamName
    };
}

export function restoreSessionAction(gameState) {
    return {
        type: "team_restoreSession",
        roomKey: gameState.roomKey,
        teamName: gameState.teamName,
        accepted: gameState.accepted
    };
}

export function teamAcceptedAction() {
    return {
        type: "team_accepted"
    };
}

export function teamRejectedAction() {
    return {
        type: "team_rejected"
    };
}

export function joinRoom(roomKey, teamName) {
    const method = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ teamName: teamName })
    };
    return dispatch => {
        fetch(`${environment.API_URL}/room/${roomKey}`, method)
            .then(async response => {
                const body = await response.json();
                console.log("JOIN ROOM");
                console.log(body);
                console.log("----------");
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    dispatch(joinRoomAction(body));
                    dispatch(viewWaitingscreenAction());
                    dispatch(initSocket());
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
                console.log("RESTORE");
                console.log(body);
                console.log("----------");
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    dispatch(restoreSessionAction(body));
                    dispatch(restoreActiveScreenFromGameState(body.gameState));
                    dispatch(initSocket());
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
}
