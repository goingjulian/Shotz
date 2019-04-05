import environment from '../environments/environment'
import { setViewByGameState } from './viewActions'

export const roundsActionTypes = {
    startRound: "startRound",
    setRounds: "setRounds",
    nextQuestion: "nextQuestion"
}

export function startRound(roomKey, categories) {
    return async dispatch => {
        const method = {
            method: "POST",
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ 
                categories: categories
             }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(`${environment.API_URL}/room/${roomKey}/round`, method);

        if(!response.ok) throw new Error('Error starting round');

        const body = await response.json();
        console.log("BODY: ", body)
        dispatch(setRoundsAction(body.rounds, body.currentQuestionIndex));
        dispatch(setViewByGameState(body.gameState));
    }
}

export function setRoundsAction(rounds, currentQuestionIndex) {
    console.log("ROUNDS", rounds, currentQuestionIndex)
    return {
        type: roundsActionTypes.setRounds,
        rounds: rounds,
        currentQuestionIndex: currentQuestionIndex
    }
}

export function nextquestionAction(activeQuestionIndex) {
    return {
        type: roundsActionTypes.nextQuestion,
        activeQuestionIndex: activeQuestionIndex
    }
    //todo: reducer
}

export function nextQuestion() {
    return async dispatch => {
        //fetch endpoint
        //call action

    }
}

