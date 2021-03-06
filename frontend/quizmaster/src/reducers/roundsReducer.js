import { roundsActionTypes } from '../actions/roundsActions'

const initialRoundsState = {
    rounds: [],
    answerRevealed: false
}

export default function roundsReducer(state = initialRoundsState, action) {
    let roundsCopy;
    switch (action.type) {
        case roundsActionTypes.setRounds:
            return { ...state, rounds: action.rounds }
        case roundsActionTypes.nextQuestion:
            roundsCopy = [...state.rounds];
            roundsCopy[roundsCopy.length - 1].activeQuestionIndex = action.activeQuestionIndex;
            return { ...state, rounds: roundsCopy, answerRevealed: false }
        case roundsActionTypes.setQuestions:
            roundsCopy = [...state.rounds];
            roundsCopy[roundsCopy.length - 1].questions = action.questions;
            return { ...state, rounds: roundsCopy }
        case roundsActionTypes.revealAnswer:
            return { ...state, answerRevealed: true }
        default:
            return state;

    }
}