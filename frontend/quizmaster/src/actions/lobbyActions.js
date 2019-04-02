export const lobbyActionTypes = {
    addTeam: "addTeam",
    addMultipleTeams: "addMultipleTeams",
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

export function addMultipleTeams(teamList) {
    return {
        type: lobbyActionTypes.addMultipleTeams,
        teamList: teamList
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