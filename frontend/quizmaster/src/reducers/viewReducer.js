import Login from '../components/Login'
import Lobby from '../components/Lobby'

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
        case viewActionTypes.createRoomAction:
            return { ...state, activeView: views.Lobby };
        default:
            return state;
    }

};