import { teamActionTypes } from "../actions/teamActions";

const initialTeamState = {
    teamList: []
};

export default function teamReducer(state = initialTeamState, action) {
    switch (action.type) {
        case teamActionTypes.SET_TEAMS:
            return { ...state, teamList: action.teamList };
        default:
            return { ...state };
    }

    // case lobbyActionTypes.addTeam:
    //     console.log("team +", action)
    //     const teamListCopy = [...state.teamList]
    //     teamListCopy.push({
    //         id: action.teamId,
    //         name: action.teamName,
    //         accept: false
    //     })
    //     return { ...state, teamList: teamListCopy }
    // case lobbyActionTypes.addMultipleTeams:
    //     console.log("adding multiple teams")
    //     return { ...state, teamList: action.teamList }
    // case lobbyActionTypes.acceptTeam:
    //     const teamIndexAccept = state.teamList.findIndex(team => team.id === action.id);
    //     teamsCopy[teamIndexAccept].accept = true;
    //     return { ...state, teamList: teamsCopy }
    // case lobbyActionTypes.rejectTeam:
    //     const teamIndexReject = state.teamList.findIndex(team => team.id === action.id);
    //     teamsCopy.splice(teamIndexReject, 1);
    //     return { ...state, teamList: teamsCopy }
    // case lobbyActionTypes.clearRejectedTeams:
    //     const acceptedTeams = teamsCopy.filter(team => team.accept)
    //     return { ...state, teamList: acceptedTeams }
    // default:
    //     return state
}
