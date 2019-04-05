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
            teamIndex = state.teamList.findIndex(team => team.sessionId === action.sessionId);
            teamList = state.teamList.slice();
            teamList[teamIndex].accepted = true;
            return { ...state, teamList: teamList };
        case teamActionTypes.REJECT_TEAM:
            teamIndex = state.teamList.findIndex(team => team.sessionId === action.sessionId);
            teamList = state.teamList.slice();
            teamList.splice(teamIndex, 1);
            return { ...state, teamList: teamList };
        case teamActionTypes.REMOVE_TEAMS:
            return { ...initialTeamState };
        default:
            return { ...state };
    }
}
