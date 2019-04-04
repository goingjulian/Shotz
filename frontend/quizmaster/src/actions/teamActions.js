import environment from '../environments/environment'

export const teamActionTypes = {
    SET_TEAMS: "SET_TEAMS",
    ACCEPT_TEAM: "ACCEPT_TEAM",
    REJECT_TEAM: "REJECT_TEAM"
};

export function setTeams(teamList) {
    return {
        type: teamActionTypes.SET_TEAMS,
        teamList: teamList
    }
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
        const response = await fetch(`${environment.API_URL}/room/${roomKey}/team/${sessionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accepted: accepted })
        })

        const body = await response.json()

        if (!response.ok) {
            throw new Error(body.error);
        } else {
            accepted ? dispatch(acceptTeamAction(sessionId)) : dispatch(rejectTeamAction(sessionId));
        }
    }
}

export function getTeamList(roomKey) {
    console.log("Getting teamlist");
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
                dispatch(setTeams(body));
            }
        })
    };
}

export function clearRejectedTeamsAction() {

}

export function clearRejectedTeams() {
    return async dispatch => {
        const method = {
            
        }
    }
}