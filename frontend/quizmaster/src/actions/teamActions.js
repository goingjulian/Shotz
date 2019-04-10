import environment from '../environments/environment';
import { addErrorAction } from './roomActions';

export const teamActionTypes = {
  SET_TEAMS: 'SET_TEAMS',
  ACCEPT_TEAM: 'ACCEPT_TEAM',
  REJECT_TEAM: 'REJECT_TEAM',
  CLEAR_REJECTED: 'CLEAR_REJECTED',
  REMOVE_TEAMS: 'REMOVE_TEAMS',
  ADD_ANSWER: 'ADD_ANSWER',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT'
};

export function removeTeamsAction() {
  return {
    type: teamActionTypes.REMOVE_TEAMS
  };
}

export function setTeamsAction(teamList) {
  return {
    type: teamActionTypes.SET_TEAMS,
    teamList: teamList
  };
}

export function acceptTeamAction(sessionId) {
  return {
    type: teamActionTypes.ACCEPT_TEAM,
    sessionId: sessionId
  };
}

export function rejectTeamAction(sessionId) {
  return {
    type: teamActionTypes.REJECT_TEAM,
    sessionId: sessionId
  };
}

export function addSubmittedAnswerAction(teamSessionId, questionId, answer) {
  return {
    type: teamActionTypes.ADD_ANSWER,
    teamSessionId: teamSessionId,
    questionId: questionId,
    answer: answer
  };
}

export function setAnswerStatus(roomKey, questionId, teamSessionId, correct) {
  return dispatch => {
    const options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correct: correct })
    };

    fetch(
      `${environment.API_URL}/room/${roomKey}/round/question/${questionId}/answer/${teamSessionId}`,
      options
    )
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(setTeamsAction(body));
        else throw new Error('Error while setting answer status');
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function alterTeamAcceptedStatus(roomKey, sessionId, accepted) {
  return dispatch => {
    const method = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accepted: accepted })
    };

    fetch(`${environment.API_URL}/room/${roomKey}/team/${sessionId}/status`, method)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          accepted ? dispatch(acceptTeamAction(sessionId)) : dispatch(rejectTeamAction(sessionId));
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function getTeamList(roomKey) {
  return dispatch => {
    const method = {
      method: 'GET',
      credentials: 'include'
    };
    fetch(`${environment.API_URL}/room/${roomKey}/teams`, method)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(setTeamsAction(body));
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function clearRejectedTeams(roomKey) {
  return dispatch => {
    const method = {
      method: 'DELETE',
      credentials: 'include'
    };
    fetch(`${environment.API_URL}/room/${roomKey}/teams`, method)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(setTeamsAction(body));
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}
