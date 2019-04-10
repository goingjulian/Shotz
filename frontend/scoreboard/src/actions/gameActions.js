import environment from "../environments/environment";
import {
    viewLoginScreenAction,
    viewGameScreenAction,
    viewScoreScreenAction,
    restoreActiveScreenFromGameState
} from "./viewActions";

import { initSocket } from "./wsActions";

export const gameActionTypes = {
    scoreB_setRoom: "scoreB_setRoom",
    scoreB_nextQuestion: "scoreB_nextQuestion",
    scoreB_setScores: "scoreB_setScores"
}

export function nextQuestionAction(currentQuestionIndex, currentQuestion, currentAnswer) {
    return {
        type: gameActionTypes.scoreB_nextQuestion,
        currentQuestionIndex: currentQuestionIndex,
        currentQuestion: currentQuestion,
        currentAnswer: currentAnswer
    }
}

export function shotzTime() {
    return async dispatch => {
        const options = {
            method: "GET"
        }
    }
}

export function setRoomAction(roomKey, gameState, currentRound, currentQuestionIndex, teams) {
    console.log("x", teams)
    return {
        type: gameActionTypes.scoreB_setRoom,
        roomKey: roomKey,
        gameState: gameState,
        currentRound: currentRound,
        currentQuestionIndex: currentQuestionIndex,
        teams: teams
    };
}

export function endRoundScoreAction(scores) {
    return {
        type: gameActionTypes.scoreB_setScores,
        scores: scores
    }
}

export function joinRoom(roomKey) {
    const options = {
        method: "POST",
        credentials: "include"
    };
    return async dispatch => {
        try {
            const response = await fetch(`${environment.API_URL}/room/scoreboard/${roomKey}`, options)

            const body = await response.json();
            console.log("JOIN ROOM");
            console.log(body);
            console.log("----------");
            if (!response.ok) throw new Error(body.error);

            dispatch(setRoomAction(body.roomKey, body.gameState, body.currentRound, body.currentQuestionIndex, body.teams));
            dispatch(viewGameScreenAction());
            dispatch(initSocket());
        } catch (err) {
            console.log(err.message);
        }
    };
}

export function restoreSession() {
    const method = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: "Scoreboard" })
    };
    return async dispatch => {
        try {
            const response = await fetch(`${environment.API_URL}/room/restore`, method)

            const body = await response.json();
            console.log("RESTORE");
            console.log(body);
            console.log("----------");
            if (!response.ok) throw new Error(body.error);

            dispatch(setRoomAction(body.roomKey, body.gameState, body.currentRound, body.currentQuestionIndex, body.teams));
            dispatch(restoreActiveScreenFromGameState(body.gameState));
            dispatch(initSocket());

        } catch (err) {
            console.log(err.message);
        }
    };
}

export function endRoundScore(roomKey) {
    return dispatch => {
        const method = {
            method: "GET",
            credentials: "include"
        };
        fetch(`${environment.API_URL}/room/${roomKey}/scores`, method)
            .then(async response => {
                const body = await response.json();
                console.log("GET SCORE END ROUND");
                console.log(body);
                console.log("----------");
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    dispatch(endRoundScoreAction(body));
                    dispatch(viewScoreScreenAction());
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}

// export function restoreSessionAction(roomKey, teamName, accepted, question) {
//     return {
//         type: "team_restoreSession",
//         roomKey: roomKey,
//         teamName: teamName,
//         accepted: accepted,
//         question: question
//     };
// }

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

// export function setQuestionAction(question) {
//     return {
//         type: "team_setQuestion",
//         question: question
//     };
// }

// export function getCurrentQuestion(roomKey) {
//     return async dispatch => {
//         const options = {
//             method: "GET",
//             credentials: "include"
//         };

//         const response = await fetch(`${environment.API_URL}/room/${roomKey}/round/question`, options);

//         if (!response.ok) throw new Error(`Error while getting question`);

//         const body = await response.json();

//         dispatch(setQuestionAction(body));
//         // dispatch(viewQuestionScreenAction());
//     };
// }

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

// export function submitAnswer(roomKey, questionId, answer) {
//     return dispatch => {
//         const options = {
//             method: "POST",
//             credentials: "include",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 questionId: questionId,
//                 answer: answer
//             })
//         };

//         fetch(`${environment.API_URL}/room/${roomKey}/round/question/answer`, options)
//             .then(async response => {
//                 const body = await response.json();
//                 console.log("RESTORE");
//                 console.log(body);
//                 console.log("----------");
//                 if (!response.ok) {
//                     throw new Error(body.error);
//                 } else {
//                     // dispatch(viewMessageScreenAction(messageTypes.MSG_QUESTIONANSWERED));
//                     dispatch(initSocket());
//                 }
//             })
//             .catch(err => {
//                 console.log(err.message);
//             });
//     };
// }
