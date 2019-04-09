import { roundsActionTypes } from '../actions/roundsActions'

const initialRoundsState = {
    rounds: []
}

export default function roundsReducer(state = initialRoundsState, action) {
    let roundsCopy;
    switch (action.type) {
        case roundsActionTypes.setRounds:
            return { ...state, rounds: action.rounds }
        case roundsActionTypes.nextQuestion:
            roundsCopy = [...state.rounds];
            roundsCopy[roundsCopy.length - 1].activeQuestionIndex = action.activeQuestionIndex;
            return {...state, rounds: roundsCopy}
        case roundsActionTypes.setQuestions:
            roundsCopy = [...state.rounds];
            roundsCopy[roundsCopy.length - 1].questions = action.questions;
            return {...state, rounds: roundsCopy}
        default:
            return state;

    }
}