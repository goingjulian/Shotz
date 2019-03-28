export const teamActionTypes = {
    acceptTeam: "acceptTeam",
    rejectTeam: "rejectTeam"
}

export function acceptTeamAction(teamId) {
    return {
        type: teamActionTypes.acceptTeam,
        id: teamId
    }
}

export function rejectTeamAction(teamId) {
    return {
        type: teamActionTypes.rejectTeam,
        id: teamId
    }
}