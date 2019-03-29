export const teamActionTypes = {
    acceptTeam: "acceptTeam",
    rejectTeam: "rejectTeam",
    clearRejectedTeams: "clearRejectedTeams"
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