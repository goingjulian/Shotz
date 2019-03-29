import { teamActionTypes } from '../actions/lobbyActions'

const initialTeamState = {
    teamList: [
        {
            id: 0,
            name: "Team Julian",
            accept: false
        },
        {
            id: 1,
            name: "Team Wout",
            accept: false
        },
        {
            id: 2,
            name: "Team X",
            accept: false
        }
    ]
}

export default function teamReducer(state = initialTeamState, action) {
    const teamsCopy = [...state.teamList];

    switch (action.type) {
        case teamActionTypes.acceptTeam:
            const teamIndexAccept = state.teamList.findIndex(team => team.id === action.id);
            teamsCopy[teamIndexAccept].accept = true;
            return { ...state, teamList: teamsCopy }
        case teamActionTypes.rejectTeam:
            const teamIndexReject = state.teamList.findIndex(team => team.id === action.id);
            teamsCopy.splice(teamIndexReject, 1);
            return { ...state, teamList: teamsCopy }
        case teamActionTypes.clearRejectedTeams:
            const acceptedTeams = teamsCopy.filter(team => team.accept)
            return { ...state, teamList: acceptedTeams }
        default:
            return state
    }
}