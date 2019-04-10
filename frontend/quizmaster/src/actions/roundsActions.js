import environment from '../environments/environment';
import { viewEndRoundScreenAction, viewControlPanelScreenAction } from './viewActions';
import { addErrorAction } from './roomActions';

export const roundsActionTypes = {
  startRound: 'startRound',
  setRounds: 'setRounds',
  nextQuestion: 'nextQuestion',
  setQuestions: 'setQuestions',
  revealAnswer: 'revealAnswer'
};

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

export function revealAnswerAction() {
  return {
    type: roundsActionTypes.revealAnswer
  };
}

export function newRound(roomKey, categories) {
  return dispatch => {
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categories: categories
      })
    };

    fetch(`${environment.API_URL}/room/${roomKey}/round/start`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          dispatch(setRoundsAction(body.rounds, body.currentQuestionIndex));
          dispatch(viewControlPanelScreenAction());
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function endRound(roomKey) {
  return dispatch => {
    const options = {
      method: 'PUT',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room/${roomKey}/round/end`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(viewEndRoundScreenAction());
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function revealAnswer(roomKey) {
  return async dispatch => {
    const options = {
      method: 'PUT',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room/${roomKey}/round/question/reveal`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(revealAnswerAction());
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function nextQuestion(roomKey) {
  return dispatch => {
    const options = {
      method: 'PUT',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room/${roomKey}/round/question/next`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(nextQuestionAction(body.activeQuestionIndex));
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function removeQuestionFromQueue(roomKey, questionId) {
  return dispatch => {
    const options = {
      method: 'DELETE',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room/${roomKey}/round/question/${questionId}`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(setQuestionsAction(body));
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}
