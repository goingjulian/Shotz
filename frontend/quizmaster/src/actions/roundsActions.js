import environment from '../environments/environment'

export const roundsActionTypes = {
    startRound: "startRound"
}

export function startRoundAction(categories, questions) {
    return {
        type: roundsActionTypes.startRound,
        categories: categories,
        questions: questions
    }
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

        dispatch(startRoundAction(body.round.categories, body.round.questions));
    }
}

