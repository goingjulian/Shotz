import environment from '../environments/environment';
import { initSocket } from './wsActions';
import { setViewByGameState, viewLoginScreenAction } from './viewActions';
import { removeTeamsAction, setTeamsAction } from './teamActions';
import { setRoundsAction } from './roundsActions';

export const roomActionTypes = {
  CREATE_ROOM: 'CREATE_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR'
};

export function addErrorAction(error) {
  return {
    type: roomActionTypes.ADD_ERROR,
    error: error
  };
}

export function removeErrorAction(error) {
  return {
    type: roomActionTypes.REMOVE_ERROR,
    error: error
  };
}

export function createRoomAction(roomKey) {
  return {
    type: roomActionTypes.CREATE_ROOM,
    roomKey: roomKey
  };
}

export function leaveRoomAction() {
  return {
    type: roomActionTypes.LEAVE_ROOM
  };
}

export function createRoom() {
  return dispatch => {
    const options = {
      method: 'POST',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          dispatch(createRoomAction(body.roomKey));
          dispatch(setViewByGameState(body.gameState));
          dispatch(initSocket());
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function leaveRoom(roomKey) {
  return dispatch => {
    const options = {
      method: 'DELETE',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room/${roomKey}`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          dispatch(leaveRoomAction());
          dispatch(removeTeamsAction());
          dispatch(viewLoginScreenAction());
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function restoreSession() {
  return dispatch => {
    const options = {
      method: 'GET',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room/restore/ROLE_QUIZMASTER`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) {
          dispatch(setTeamsAction(body.teams));
          dispatch(createRoomAction(body.roomKey));
          dispatch(setRoundsAction(body.rounds, body.currentQuestionIndex));
          dispatch(setViewByGameState(body.gameState));
          dispatch(initSocket());
        } else {
          throw new Error(body.error);
        }
      })
      .catch(err => console.log(err.message));
  };
}
