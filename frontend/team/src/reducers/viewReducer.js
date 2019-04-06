import { viewActionTypes } from "../actions/viewActions";
import Lobby from "../components/Lobby/Lobby.jsx";
import Waitscreen from "../components/Waitscreen/Waitscreen.jsx";
import Question from "../components/Question/Question";

const initalViewState = {
    activeView: Lobby
};

export default function viewReducer(state = initalViewState, action) {
    switch (action.type) {
        case viewActionTypes.VIEW_LOBBY:
            return { ...state, activeView: Lobby };
        case viewActionTypes.VIEW_WAITINGSCREEN:
            return { ...state, activeView: Waitscreen };
        case viewActionTypes.VIEW_QUESTIONSCREEN:
            return { ...state, activeView: Question };
        default:
            return state;
    }
}
