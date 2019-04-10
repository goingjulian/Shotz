import { gameActionTypes } from '../actions/gameActions';

const initialState = {
    roomKey: null,
    gameState: null,
    currentRound: null,
    currentQuestionIndex: null,
    currentQuestion: null,
    currentAnswer: null,
    teams: null,
    shotzTime: null,
    scores: null
};
export default function gameReducer(state = initialState, action) {
    console.log(action)
    switch (action.type) {
        case gameActionTypes.scoreB_setRoom:
            return {
                ...state,
                roomKey: action.roomKey,
                gameState: action.gameState,
                currentRound: action.currentRound,
                currentQuestionIndex: action.currentQuestionIndex,
                teams: action.teams
            }
        case gameActionTypes.scoreB_nextQuestion:
            return {
                ...state,
                currentQuestionIndex: action.currentQuestionIndex,
                currentQuestion: action.currentQuestion,
                currentAnswer: action.currentQuestion
            }
        case gameActionTypes.scoreB_setScores:
            return { ...state, scores: action.scores };
        default:
            return state;
    }
}
