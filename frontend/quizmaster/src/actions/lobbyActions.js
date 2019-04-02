export const teamActionTypes = {
    addTeam: "addTeam",
    acceptTeam: "acceptTeam",
    rejectTeam: "rejectTeam",
    clearRejectedTeams: "clearRejectedTeams"
}

export function addTeam(teamId, name) {
    return {
        type: teamActionTypes.addTeam,
        teamId: teamId,
        teamName: name
    }
}

export function acceptTeamAction(id) {
    return {
        type: teamActionTypes.acceptTeam,
        id: id
    }
}

export function rejectTeamAction(id) {
    return {
        type: teamActionTypes.rejectTeam,
        id: id
    }
}

export function clearRejectedTeamsAction() {
    return {
        type: teamActionTypes.clearRejectedTeams
    }
}