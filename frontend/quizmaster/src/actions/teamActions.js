import environment from "../environments/environment";
import { categorySelectViewAction } from "./viewActions";

export const teamActionTypes = {
    SET_TEAMS: "SET_TEAMS",
    ACCEPT_TEAM: "ACCEPT_TEAM",
    REJECT_TEAM: "REJECT_TEAM",
    CLEAR_REJECTED: "CLEAR_REJECTED"
};

export function setTeams(teamList) {
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

export function alterTeamAcceptedStatus(roomKey, sessionId, accepted) {
    return async dispatch => {
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
    };
}

export function getTeamList(roomKey) {
    return dispatch => {
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
                dispatch(setTeams(body));
            }
        });
    };
}

export function clearRejectedTeamsAction(roomKey) {
    return async dispatch => {
        const method = {
            method: "DELETE",
            credentials: "include"
        };

        const response = await fetch(`${environment.API_URL}/room/${roomKey}/teams`, method);

        if (!response.ok) {
            throw new Error("Server error");
        }

        const body = await response.json();

        console.log(body);

        dispatch(setTeams(body));
        dispatch(categorySelectViewAction());
    };
}
