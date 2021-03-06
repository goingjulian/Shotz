import Login from "../components/Login/Login.jsx";
import Game from "../components/Game/Game.jsx";
import EndRound from '../components/EndRound/EndRound.jsx';
import { viewActionTypes } from "../actions/Enums.js";

const initalViewState = {
    activeView: Login,
    messageScreenText: 'If you see this, something went wrong!',
    wsAllowed: false
};

export default function viewReducer(state = initalViewState, action) {
    switch (action.type) {
        case viewActionTypes.VIEW_LOGINSCREEN:
            return { ...state, activeView: Login, wsAllowed: false };
        case viewActionTypes.VIEW_GAMESCREEN:
            return { ...state, activeView: Game, wsAllowed: true };
        case viewActionTypes.VIEW_SCORESCREEN:
            return { ...state, activeView: EndRound, wsAllowed: true };
        default:
            return state;
    }
}
