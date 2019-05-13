import environment from '../environments/environment';
import {
  viewLoginScreenAction,
  viewMessageScreenAction,
  restoreActiveScreenFromGameState,
  viewQuestionScreenAction
} from './viewActions';
import { initSocket } from './wsActions';
import { messageTypes } from './Enums';

export function addErrorAction(error) {
  return {
    type: 'ADD_ERROR',
    error: error
  };
}

export function removeErrorAction(error) {
  return {
    type: 'REMOVE_ERROR',
    error: error
  };
}

export function joinRoomAction(roomKey, teamName) {
  return {
    type: 'team_joinRoom',
    roomKey: roomKey,
    teamName: teamName
  };
}

export function restoreSessionAction(roomKey, teamName, accepted, question) {
  return {
    type: 'team_restoreSession',
    roomKey: roomKey,
    teamName: teamName,
    accepted: accepted,
    question: question
  };
}

export function teamAcceptedAction() {
  return {
    type: 'team_accepted'
  };
}

export function teamRejectedAction() {
  return {
    type: 'team_rejected'
  };
}

export function leaveRoomAction() {
  return {
    type: 'team_leaveRoom'
  };
}

export function setQuestionAction(question) {
  return {
    type: 'team_setQuestion',
    question: question
  };
}

export function getCurrentQuestion(roomKey) {
  return dispatch => {
    const options = {
      method: 'GET',
      credentials: 'include'
    };
    fetch(`${environment.API_URL}/room/${roomKey}/round/question`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          dispatch(setQuestionAction(body));
          dispatch(viewQuestionScreenAction());
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => {
        dispatch(addErrorAction(err.message));
      });
  };
}

export function leaveRoom(roomKey) {
  return dispatch => {
    const method = {
      method: 'DELETE',
      credentials: 'include'
    };
    fetch(`${environment.API_URL}/room/${roomKey}`, method)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          dispatch(viewLoginScreenAction());
          dispatch(leaveRoomAction());
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => {
        dispatch(addErrorAction(err.message));
      });
  };
}

export function joinRoom(roomKey, teamName) {
  const method = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ teamName: teamName })
  };
  return dispatch => {
    fetch(`${environment.API_URL}/room/${roomKey}`, method)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          dispatch(joinRoomAction(body.roomKey, body.teamName));
          dispatch(viewMessageScreenAction(messageTypes.MSG_APPROVAL));
          dispatch(initSocket());
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => {
        dispatch(addErrorAction(err.message));
      });
  };
}

export function restoreSession() {
  const method = {
    method: 'GET',
    credentials: 'include'
  };
  return dispatch => {
    fetch(`${environment.API_URL}/room/restore/ROLE_TEAM`, method)
      .then(async response => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error);
        } else {
          dispatch(restoreSessionAction(body.roomKey, body.teamName, body.accepted, body.question));
          dispatch(restoreActiveScreenFromGameState(body.gameState, body.accepted));
          dispatch(initSocket());
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };
}

export function submitAnswer(roomKey, questionId, answer) {
  return dispatch => {
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer: answer
      })
    };

    fetch(`${environment.API_URL}/room/${roomKey}/round/question/${questionId}/answer`, options)
      .then(async response => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error);
        } else {
          dispatch(viewMessageScreenAction(messageTypes.MSG_QUESTIONANSWERED));
        }
      })
      .catch(err => {
        dispatch(addErrorAction(err.message));
      });
  };
}

export function endRoundScore(roomKey, teamName) {
  return dispatch => {
    const method = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch(`${environment.API_URL}/room/${roomKey}/teams/scores`, method)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          const sortedTeams = body.slice().sort((a, b) => {
            if (a.score > b.score) return -1;
            if (a.score < b.score) return 1;
            return 0;
          });
          const team = sortedTeams.find(team => team.teamName === teamName);
          const teamPosition = sortedTeams.findIndex(team => team.teamName === teamName) + 1;
          dispatch(
            viewMessageScreenAction(
              `End round! Your score is: ${team.score}. Your position is ${teamPosition}.`
            )
          );
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => {
        dispatch(addErrorAction(err.message));
      });
  };
}
