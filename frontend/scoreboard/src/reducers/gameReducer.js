import { gameActionTypes } from '../actions/gameActions';
import gameStates from '../definitions/gameStates';

const initialState = {
    roomKey: null,
    gameState: null,
    currentRound: null,
    currentQuestionIndex: null,
    currentQuestion: null,
    teams: null,
    shotzTime: null,
    scores: null,
    revealAnswer: false
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
                teams: action.teams,
                revealAnswer: false
            }
        case gameActionTypes.scoreB_nextQuestion:
            return {
                ...state,
                currentQuestionIndex: action.currentQuestionIndex,
                currentQuestion: action.currentQuestion,
                gameState: gameStates.IN_ROUND,
                revealAnswer: false
            }
        case gameActionTypes.scoreB_setScores:
            return { ...state, scores: action.scores, revealAnswer: false };
        case gameActionTypes.scoreB_setTeams:
            return { ...state, teams: action.teams };
        case gameActionTypes.scoreB_endGame:
            return { ...state, teams: action.teams, gameState: gameStates.END_GAME, revealAnswer: false }
        case gameActionTypes.scoreB_selecting_categories:
            return { ...state, gameState: gameStates.CATEGORY_SELECT }
        case gameActionTypes.scoreB_incCurRound:
            let currentRoundCopy = state.currentRound.valueOf();
            currentRoundCopy++;
            return { ...state, currentRound: currentRoundCopy }
        case gameActionTypes.scoreB_revealAnswer:
            return { ...state, revealAnswer: true }
        default:
            return state;
    }
}
