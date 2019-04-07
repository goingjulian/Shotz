import environment from "../environments/environment";
import { viewWaitingscreenAction, restoreActiveScreenFromGameState, viewLobbyAction, viewQuestionScreenAction } from "./viewActions";
import { initSocket } from "./wsActions";

export function joinRoomAction(roomKey, teamName) {
    return {
        type: "team_joinRoom",
        roomKey: roomKey,
        teamName: teamName
    };
}

export function restoreSessionAction(roomKey, teamName, accepted, question) {
    return {
        type: "team_restoreSession",
        roomKey: roomKey,
        teamName: teamName,
        accepted: accepted,
        question: question
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

export function leaveGameAction() {
    return {
        type: "team_leaveGame"
    };
}

export function setQuestionAction(question) {
    return {
        type: "team_setQuestion",
        question: question
    }
}

export function getCurrentQuestion(roomKey) {
    return async dispatch => {
        const options = {
            method: "GET",
            credentials: "include"
        }

        const response = await fetch(`${environment.API_URL}/room/${roomKey}/round/question`, options);
        
        if(!response.ok) throw new Error(`Error while getting question`);

        const body = await response.json();

        dispatch(setQuestionAction(body));
        dispatch(viewQuestionScreenAction());
    }
}

export function leaveGame(roomKey) {
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
                dispatch(viewLobbyAction());
                dispatch(leaveGameAction());
                // throw new Error(body.error);
            })
            .catch(err => {
                console.log(err.message);
            });
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
                    dispatch(joinRoomAction(body.roomKey, body.teamName));
                    dispatch(viewWaitingscreenAction());
                    dispatch(initSocket());
                }
            })
            .catch(err => {
                console.log(err.message);
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
                    dispatch(restoreSessionAction(body.roomKey, body.teamName, body.accepted, body.question));
                    dispatch(restoreActiveScreenFromGameState(body.gameState));
                    dispatch(initSocket());
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}

export function submitAnswer(roomKey, questionId, answer) {
    return async dispatch => {
        const options = {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                questionId: questionId,
                answer: answer
            })
        }
        const response = await fetch(`${environment.API_URL}/room/${roomKey}/round/question/answer`, options)

        if(!response.ok) throw new Error(`Error while submitting answer`);

        const body = await response.json();

        console.log(body);
    }
}
