import environment from "../environments/environment";
import {
    viewLoginScreenAction,
    viewGameScreenAction
} from "./viewActions";
import { initSocket } from "./wsActions";
import { messageTypes } from "./Enums";

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

export function leaveRoomAction() {
    return {
        type: "team_leaveRoom"
    };
}

export function setQuestionAction(question) {
    return {
        type: "team_setQuestion",
        question: question
    };
}

export function getCurrentQuestion(roomKey) {
    return async dispatch => {
        const options = {
            method: "GET",
            credentials: "include"
        };

        const response = await fetch(`${environment.API_URL}/room/${roomKey}/round/question`, options);

        if (!response.ok) throw new Error(`Error while getting question`);

        const body = await response.json();

        dispatch(setQuestionAction(body));
        // dispatch(viewQuestionScreenAction());
    };
}

export function leaveRoom(roomKey) {
    return dispatch => {
        const method = {
            method: "DELETE",
            credentials: "include"
        };
        fetch(`${environment.API_URL}/room/${roomKey}/leave`, method)
            .then(async response => {
                const body = await response.json();
                console.log("LEAVING ROOM");
                console.log(body);
                console.log("----------");
                dispatch(viewLoginScreenAction());
                dispatch(leaveRoomAction());
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
                    // dispatch(viewMessageScreenAction(messageTypes.MSG_APPROVAL));
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
                    // dispatch(restoreActiveScreenFromGameState(body.gameState, body.accepted));
                    dispatch(initSocket());
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}

export function submitAnswer(roomKey, questionId, answer) {
    return dispatch => {
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
        };

        fetch(`${environment.API_URL}/room/${roomKey}/round/question/answer`, options)
            .then(async response => {
                const body = await response.json();
                console.log("RESTORE");
                console.log(body);
                console.log("----------");
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    // dispatch(viewMessageScreenAction(messageTypes.MSG_QUESTIONANSWERED));
                    dispatch(initSocket());
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}

export function endRoundScore(roomKey) {
    return dispatch => {
        const method = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        };
        fetch(`${environment.API_URL}/room/${roomKey}/score`, method)
            .then(async response => {
                const body = await response.json();
                console.log("GET SCORE END ROUND");
                console.log(body);
                console.log("----------");
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    // dispatch(viewMessageScreenAction(`End round ${body.round}. Your position is ${body.position}.`));
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}
