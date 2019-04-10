import environment from "../environments/environment";
import { setViewByGameState, viewEndRoundScreenAction } from "./viewActions";

export const roundsActionTypes = {
  startRound: "startRound",
  setRounds: "setRounds",
  nextQuestion: "nextQuestion",
  setQuestions: "setQuestions"
};

// TODO combine actions
export function setRoundsAction(rounds, currentQuestionIndex) {
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

export function setQuestionsAction(questions) {
  return {
    type: roundsActionTypes.setQuestions,
    questions: questions
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
    fetch(`${environment.API_URL}/room/${roomKey}/round/start`, options)
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
    if (!response.ok) throw new Error(`Error proceeding to next question`);

    const body = await response.json();
    console.log(body);

    dispatch(nextQuestionAction(body.activeQuestionIndex));
  };
}

export function removeQuestionFromQueue(roomKey, questionId) {
  return async dispatch => {
    try {
      const options = {
        method: "DELETE",
        credentials: "include"
      };

      const response = await fetch(`${environment.API_URL}/room/${roomKey}/round/question/${questionId}`, options);

      if (!response.ok) throw new Error("Error while removing question from queue");

      const body = await response.json();

      dispatch(setQuestionsAction(body));
    } catch (err) {
      console.log(err);
    }
  };
}
