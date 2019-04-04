import { roundsActionTypes } from '../actions/roundsActions'

const initialRoundsState = {
    rounds: []
}

export default function roundsReducer(state = initialRoundsState, action) {
    switch (action.type) {
        case roundsActionTypes.startRound:
            console.log(action)
            if (action.categories.length > 0 && action.categories.length <= 3) {
                const roundsCopy = [...state.rounds];
                roundsCopy.push(
                    {
                        categories: action.categories,
                        questions: action.questions
                    }
                );
                return { ...state, rounds: roundsCopy }
            } else {
                return state;
            }
        default:
            return state;

    }
}