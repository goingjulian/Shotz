import environment from "../environments/environment";
import { setViewByGameState, viewEndRoundScreenAction } from "./viewActions";
import { setTeamsAction } from "./teamActions";

export const roundsActionTypes = {
    startRound: "startRound",
    setRounds: "setRounds",
    nextQuestion: "nextQuestion"
};

// TODO combine actions
export function setRoundsAction(rounds, currentQuestionIndex) {
    console.log("ROUNDS", rounds, currentQuestionIndex);
    return {
        type: roundsActionTypes.setRounds,
        rounds: rounds,
        currentQuestionIndex: currentQuestionIndex
    };
}

export function nextQuestionAction(activeQuestionIndex) {
    return {
        type: roundsActionTypes.nextQuestion,
        activeQuestionIndex: activeQuestionIndex
    };
}

export function newRound(roomKey, categories) {
    return dispatch => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                categories: categories
            })
        };
        fetch(`${environment.API_URL}/room/${roomKey}/round`, options)
            .then(async response => {
                const body = await response.json();
                if (response.ok) {
                    dispatch(setRoundsAction(body.rounds, body.currentQuestionIndex));
                    dispatch(setViewByGameState(body.gameState));
                } else {
                    throw new Error(body.error);
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}

export function endRound(roomKey) {
    return dispatch => {
        const options = {
            method: "PUT",
            credentials: "include"
        };
        fetch(`${environment.API_URL}/room/${roomKey}/round/end`, options)
            .then(async response => {
                const body = await response.json();
                if (response.ok) {
                    dispatch(setTeamsAction(body));
                    dispatch(viewEndRoundScreenAction());
                } else {
                    throw new Error(body.error);
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}

export function nextQuestion(roomKey) {
    return async dispatch => {
        const options = {
            method: "PUT",
            credentials: "include"
        };

        const response = await fetch(`${environment.API_URL}/room/${roomKey}/round/question/next`, options);
        console.log(response.ok);
        if (!response.ok) throw new Error(`Error proceeding to next question`);

        const body = await response.json();
        console.log(body);

        dispatch(nextQuestionAction(body.activeQuestionIndex));
    };
}
