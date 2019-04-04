import { teamActionTypes } from "../actions/teamActions";

const initialTeamState = {
    teamList: []
};

export default function teamReducer(state = initialTeamState, action) {
    let teamIndex, teamList;
    switch (action.type) {
        case teamActionTypes.SET_TEAMS:
            return { ...state, teamList: action.teamList };
        case teamActionTypes.ACCEPT_TEAM:
            teamIndex = state.teamList.findIndex(team => team.sessionid === action.sessionId);
            teamList = state.teamList.slice();
            teamList[teamIndex].accepted = true;
            return { ...state, teamList: teamList };
        case teamActionTypes.REJECT_TEAM:
            teamIndex = state.teamList.findIndex(team => team.sessionId === action.sessionId);
            teamList = state.teamList.slice();
            teamList.splice(teamIndex, 1);
            return { ...state, teamList: teamList };
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
    //case lobbyActionTypes.rejectTeam:
    //   const teamIndexReject = state.teamList.findIndex(team => team.id === action.id);
    // teamsCopy.splice(teamIndexReject, 1);
    // return { ...state, teamList: teamsCopy }
    // case lobbyActionTypes.clearRejectedTeams:
    //     const acceptedTeams = teamsCopy.filter(team => team.accept)
    //     return { ...state, teamList: acceptedTeams }
    // default:
    //     return state
}
