import { lobbyActionTypes } from '../actions/lobbyActions'

const initialLobbyState = {
    teamList: [
        // {
        //     id: 0,
        //     name: "Team Julian",
        //     accept: false
        // },
        // {
        //     id: 1,
        //     name: "Team Wout",
        //     accept: false
        // },
        // {
        //     id: 2,
        //     name: "Team X",
        //     accept: false
        // }
    ]
}

export default function lobbyReducer(state = initialLobbyState, action) {
    const teamsCopy = [...state.teamList];

    switch (action.type) {
        case lobbyActionTypes.addTeam:
            console.log("team +", action)
            const teamListCopy = [...state.teamList]
            teamListCopy.push({
                id: action.teamId,
                name: action.teamName,
                accept: false
            })
            return { ...state, teamList: teamListCopy }
        case lobbyActionTypes.acceptTeam:
            const teamIndexAccept = state.teamList.findIndex(team => team.id === action.id);
            teamsCopy[teamIndexAccept].accept = true;
            return { ...state, teamList: teamsCopy }
        case lobbyActionTypes.rejectTeam:
            const teamIndexReject = state.teamList.findIndex(team => team.id === action.id);
            teamsCopy.splice(teamIndexReject, 1);
            return { ...state, teamList: teamsCopy }
        case lobbyActionTypes.clearRejectedTeams:
            const acceptedTeams = teamsCopy.filter(team => team.accept)
            return { ...state, teamList: acceptedTeams }
        default:
            return state
    }
}