import environment from '../environments/environment'
import { setViewByGameState } from './viewActions'

export const roundsActionTypes = {
    startRound: "startRound",
    setRounds: "setRounds"
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
        dispatch(setRoundsAction(body.rounds));
        dispatch(setViewByGameState(body.gameState));
    }
}

export function setRoundsAction(rounds) {
    console.log("ROUNDS", rounds)
    return {
        type: roundsActionTypes.setRounds,
        rounds: rounds
    }
}

