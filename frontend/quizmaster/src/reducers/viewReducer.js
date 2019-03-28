import Login from '../components/Login.jsx'
import Lobby from '../components/Lobby/Lobby.jsx'

import { viewActionTypes } from '../actions/viewActions'

const views = {
    Login: Login,
    Lobby: Lobby
};

const initalViewState = {
    activeView: views.Login
};

export default function viewReducer(state = initalViewState, action) {
    switch (action.type) {
        case viewActionTypes.LobbyView:
            return { ...state, activeView: views.Lobby };
        default:
            return state;
    }

};