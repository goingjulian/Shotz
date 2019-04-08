import environment from "../environments/environment";
import { categorySelectViewAction } from "./viewActions";

export const teamActionTypes = {
    SET_TEAMS: "SET_TEAMS",
    ACCEPT_TEAM: "ACCEPT_TEAM",
    REJECT_TEAM: "REJECT_TEAM",
    CLEAR_REJECTED: "CLEAR_REJECTED",
    REMOVE_TEAMS: "REMOVE_TEAMS",
    ADD_ANSWER: "ADD_ANSWER",
    ANSWER_CORRECT: "ANSWER_CORRECT",
    ANSWER_INCORRECT: "ANSWER_INCORRECT"
};

export function removeTeamsAction() {
    return {
        type: teamActionTypes.REMOVE_TEAMS
    };
}

export function setTeamsAction(teamList) {
    return {
        type: teamActionTypes.SET_TEAMS,
        teamList: teamList
    };
}

export function acceptTeamAction(sessionId) {
    return {
        type: teamActionTypes.ACCEPT_TEAM,
        sessionId: sessionId
    };
}

export function rejectTeamAction(sessionId) {
    return {
        type: teamActionTypes.REJECT_TEAM,
        sessionId: sessionId
    };
}

export function addSubmittedAnswerAction(teamSessionId, questionId, answer) {
    return {
        type: teamActionTypes.ADD_ANSWER,
        teamSessionId: teamSessionId,
        questionId: questionId,
        answer: answer,
        correct: null
    }
}

export function setAnswerStatus(roomKey, questionId, teamSessionId, correct) {
    console.log(roomKey, questionId, teamSessionId, correct)
    return async dispatch => {
        const options = {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({correct: correct, teamSessionId: teamSessionId})
        }

        const response = await fetch(`${environment.API_URL}/room/${roomKey}/round/questions/answer/${questionId}`, options);
        if(!response.ok) throw new Error('Error while setting answer status');

        const body = await response.json();

        console.log(typeof body);

        dispatch(setTeamsAction(body));

        // console.log(response);
    }
}

export function alterTeamAcceptedStatus(roomKey, sessionId, accepted) {
    console.log('alter stat: ', sessionId, roomKey, accepted);
    return async dispatch => {
        try {
            const method = {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ accepted: accepted })
            };

            const response = await fetch(`${environment.API_URL}/room/${roomKey}/team/${sessionId}`, method);
            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.error);
            } else {
                console.log("ALTER TEAM STATUS BODY:");
                console.log(body);
                console.log("----------");
                accepted ? dispatch(acceptTeamAction(body.sessionId)) : dispatch(rejectTeamAction(body.sessionId));
            }
        } catch (err) {
            console.log(err.message);
        }
    };
}

export function getTeamList(roomKey) {
    return dispatch => {
        try {
            const method = {
                method: "GET",
                credentials: "include"
            };
            fetch(`${environment.API_URL}/room/${roomKey}/teams`, method).then(async response => {
                const body = await response.json();
                if (!response.ok) {
                    throw new Error(body.error);
                } else {
                    console.log("TEAM LIST BODY:");
                    console.log(body);
                    console.log("----------");
                    dispatch(setTeamsAction(body));
                }
            });
        } catch (err) {
            console.log(err.message);
        }
    };
}

export function clearRejectedTeams(roomKey) {
    return async dispatch => {
        try {
            const method = {
                method: "DELETE",
                credentials: "include"
            };
            const response = await fetch(`${environment.API_URL}/room/${roomKey}/teams`, method);
            const body = await response.json();
            if (!response.ok) {
                throw new Error("Server error");
            } else {
                dispatch(setTeamsAction(body));
                dispatch(categorySelectViewAction());
            }
        } catch (err) {
            console.log(err.message);
        }
    };
}
