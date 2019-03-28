import Login from '../components/Login/Login.jsx'
import Lobby from '../components/Lobby/Lobby.jsx'

import { viewActionTypes } from '../actions/viewActions'

const initalViewState = {
    activeView: Login
};

export default function viewReducer(state = initalViewState, action) {
    switch (action.type) {
        case viewActionTypes.LobbyView:
            return { ...state, activeView: Lobby };
        case viewActionTypes.LoginView:
            return { ...state, activeView: Login }
        default:
            return state;
    }

};