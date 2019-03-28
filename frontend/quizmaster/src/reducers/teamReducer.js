import { teamActionTypes } from '../actions/teamActions'

const initialTeamState = {
    teams: [
        {
            id: 0,
            name: "Team Julian",
            accept: false
        },
        {
            id: 1,
            name: "Team Wout",
            accept: true
        }
    ]
}

export default function teamReducer(state = initialTeamState, action) {
    switch (action.type) {
        case teamActionTypes.acceptTeam:
            return state
        case teamActionTypes.rejectTeam:
            return state
        default:
            return state
    }
}