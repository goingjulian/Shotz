import environment from '../environments/environment';
import { addErrorAction } from './roomActions';

export const viewActionTypes = {
  VIEW_LOBBY_SCREEN: 'VIEW_LOBBY_SCREEN',
  VIEW_LOGIN_SCREEN: 'VIEW_LOGIN_SCREEN',
  VIEW_CATEGORYSELECTION_SCREEN: 'VIEW_CATEGORYSELECTION_SCREEN',
  VIEW_CPANEL_SCREEN: 'VIEW_CPANEL_SCREEN',
  VIEW_END_ROUND_SCREEN: 'VIEW_END_ROUND_SCREEN'
};

export function viewLoginScreenAction() {
  return {
    type: viewActionTypes.VIEW_LOGIN_SCREEN
  };
}

export function viewLobbyAction() {
  return {
    type: viewActionTypes.VIEW_LOBBY_SCREEN
  };
}

export function viewCategorySelectionScreenAction() {
  return {
    type: viewActionTypes.VIEW_CATEGORYSELECTION_SCREEN
  };
}

export function viewControlPanelScreenAction() {
  return {
    type: viewActionTypes.VIEW_CPANEL_SCREEN
  };
}

export function viewEndRoundScreenAction() {
  return {
    type: viewActionTypes.VIEW_END_ROUND_SCREEN
  };
}

export function setCategorySelectState(roomKey) {
  return dispatch => {
    const options = {
      method: 'PUT',
      credentials: 'include'
    };
    
    fetch(
      `${environment.API_URL}/room/${roomKey}/round/select-category`,
      options
    )
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(viewCategorySelectionScreenAction());
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}

export function setViewByGameState(gameState) {
    return dispatch => {
        switch (gameState) {
            case "REGISTER":
                dispatch(viewLobbyAction());
                break;
            case "CATEGORY_SELECT":
                dispatch(viewCategorySelectionScreen());
                break;
            case "IN_ROUND":
            case "SUBMIT_CLOSED":
                dispatch(viewControlPanelScreenAction());
                break;
            case "END_ROUND":
                dispatch(viewEndRoundScreenAction());
                break;
            default:
                dispatch(viewLoginScreenAction());
                break;
        }
    };
}
