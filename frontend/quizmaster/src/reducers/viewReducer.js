import Login from "../components/Login/Login.jsx";
import Lobby from "../components/Lobby/Lobby.jsx";
import CategorySelect from "../components/CategorySelect/CategorySelect.jsx";
import ControlPanel from "../components/ControlPanel/ControlPanel.jsx";
import { viewActionTypes } from "../actions/viewActions";
import EndRound from "../components/EndRound/EndRound.jsx";

const initalViewState = {
    activeView: Login
};

export default function viewReducer(state = initalViewState, action) {
    switch (action.type) {
        case viewActionTypes.VIEW_LOGIN_SCREEN:
            return { ...state, activeView: Login };
        case viewActionTypes.VIEW_LOBBY_SCREEN:
            return { ...state, activeView: Lobby };
        case viewActionTypes.VIEW_CATEGORYSELECTION_SCREEN:
            return { ...state, activeView: CategorySelect };
        case viewActionTypes.VIEW_CPANEL_SCREEN:
            return { ...state, activeView: ControlPanel };
        case viewActionTypes.VIEW_END_ROUND_SCREEN:
            return { ...state, activeView: EndRound };
        default:
            return state;
    }
}
