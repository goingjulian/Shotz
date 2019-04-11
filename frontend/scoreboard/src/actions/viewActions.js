import { viewActionTypes } from './Enums';
import gameStates from '../definitions/gameStates';

export function viewLoginScreenAction() {
  return {
    type: viewActionTypes.VIEW_LOGINSCREEN
  };
}

export function viewGameScreenAction() {
  return {
    type: viewActionTypes.VIEW_GAMESCREEN
  };
}

export function viewScoreScreenAction() {
  return {
    type: viewActionTypes.VIEW_SCORESCREEN
  };
}

export function restoreActiveScreenFromGameState(gameState) {
  return dispatch => {
    switch (gameState) {
      case gameStates.REGISTER:
      case gameStates.CATEGORY_SELECT:
      case gameStates.IN_ROUND:
        dispatch(viewGameScreenAction());
        break;
      case gameStates.END_ROUND:
        dispatch(viewScoreScreenAction());
        break;
      case gameStates.SUBMIT_CLOSED:
        dispatch(viewGameScreenAction());
        break;
      default:
        dispatch(viewLoginScreenAction());
        break;
    }
  };
}
