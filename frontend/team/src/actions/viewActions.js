import environment from "../environments/environment";

export const viewActionTypes = {
  VIEW_LOBBY: 1,
  VIEW_WAITINGSCREEN: 2
};

export function viewLobbyAction() {
  return {
    type: viewActionTypes.VIEW_LOBBY
  };
}

export function viewWaitingscreenAction() {
  return {
    type: viewActionTypes.VIEW_WAITSCREEN
  };
}

export function joinRoomAction(roomCode, teamName) {
  console.log(roomCode);
  console.log(teamName);
  const body = {
    name: teamName
  };
  const method = {
    method: "POST",
    body: JSON.stringify(body)
  };
  return dispatch => {
    fetch(`${environment.API_URL}/room/${roomCode}`, method)
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response);
        return dispatch(viewWaitingscreenAction());
      })
      .catch(err => {
        console.log(err);
      });
  };
}
