export const lobbyActionTypes = {
    addTeam: "addTeam",
    acceptTeam: "acceptTeam",
    rejectTeam: "rejectTeam",
    clearRejectedTeams: "clearRejectedTeams"
}

export function addTeam(teamId, name) {
    return {
        type: lobbyActionTypes.addTeam,
        teamId: teamId,
        teamName: name
    }
}

export function acceptTeamAction(id) {
    return {
        type: lobbyActionTypes.acceptTeam,
        id: id
    }
}

export function rejectTeamAction(id) {
    return {
        type: lobbyActionTypes.rejectTeam,
        id: id
    }
}

export function clearRejectedTeamsAction() {
    return {
        type: lobbyActionTypes.clearRejectedTeams
    }
}