import Login from "../components/Login/Login.jsx";
import Game from "../components/Game/Game.jsx";
import { viewActionTypes } from "../actions/Enums.js";

const initalViewState = {
    activeView: Game,
    messageScreenText: 'If you see this, something went wrong!',
    wsAllowed: false
};

export default function viewReducer(state = initalViewState, action) {
    switch (action.type) {
        case viewActionTypes.VIEW_LOGINSCREEN:
            return { ...state, activeView: Login, wsAllowed: false };
        case viewActionTypes.VIEW_MESSAGESCREEN:
            return { ...state, activeView: Game, messageScreenText: action.message, wsAllowed: true };
        default:
            return state;
    }
}
