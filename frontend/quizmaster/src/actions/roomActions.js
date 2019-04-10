import environment from "../environments/environment";
import { initSocket } from "./wsActions";
import { setViewByGameState, loginViewAction } from "./viewActions";
import { removeTeamsAction, setTeamsAction } from "./teamActions";
import { setRoundsAction } from "./roundsActions";

export const roomActionTypes = {
  CREATE_ROOM: "CREATE_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",
  ADD_ERROR: "ADD_ERROR",
  REMOVE_ERROR: "REMOVE_ERROR"
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
  return async dispatch => {
    try {
      const response = await fetch(`${environment.API_URL}/room`, {
        method: "POST",
        credentials: "include"
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        dispatch(createRoomAction(body.roomKey));
        dispatch(setViewByGameState(body.gameState));
        dispatch(initSocket());
      }
    } catch (err) {
      dispatch(addErrorAction(err.message));
    }
  };
}

export function leaveRoom(roomKey) {
  const method = {
    method: "DELETE",
    credentials: "include"
  };
  return dispatch => {
    fetch(`${environment.API_URL}/room/${roomKey}`, method)
      .then(async response => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error);
        } else {
          dispatch(leaveRoomAction());
          dispatch(removeTeamsAction());
          dispatch(loginViewAction());
        }
      })
      .catch(err => {
        dispatch(addErrorAction(err.message));
      });
  };
}

export function restoreSession() {
  return async dispatch => {
    try {
      const response = await fetch(`${environment.API_URL}/room/restore/ROLE_QUIZMASTER`, {
        method: "GET",
        credentials: "include"
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error);
      } else {
        dispatch(setTeamsAction(body.teams));
        dispatch(createRoomAction(body.roomKey));
        dispatch(setRoundsAction(body.rounds, body.currentQuestionIndex));
        dispatch(setViewByGameState(body.gameState));
        dispatch(initSocket());
      }
    } catch (err) {
      console.log(err.message);
    }
  };
}
