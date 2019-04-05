import { roundsActionTypes } from '../actions/roundsActions'

const initialRoundsState = {
    rounds: []
}

export default function roundsReducer(state = initialRoundsState, action) {
    switch (action.type) {
        case roundsActionTypes.setRounds:
        console.log("ROUNDS REDUCER", action.rounds)
        console.log(action.currentRound)
            return {...state, rounds: action.rounds}
        default:
            return state;

    }
}