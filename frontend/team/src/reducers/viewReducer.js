import { viewActionTypes } from "../actions/viewActions";
import Lobby from "../components/Lobby/Lobby";
import Waitscreen from "../components/Waitscreen/Waitscreen";

const initalViewState = {
  activeView: Lobby
};

export default function viewReducer(state = initalViewState, action) {
  switch (action.type) {
    case viewActionTypes.VIEW_LOBBY:
      return { ...state, activeView: Lobby };
      case viewActionTypes.VIEW_WAITSCREEN :
      return { ...state, activeView: Waitscreen };

    default:
      return state;
  }
}
