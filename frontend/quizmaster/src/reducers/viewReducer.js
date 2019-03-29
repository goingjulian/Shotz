import Login from '../components/Login/Login.jsx'
import Lobby from '../components/Lobby/Lobby.jsx'
import CategorySelect from '../components/CategorySelect/CategorySelect.jsx'

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
        case viewActionTypes.CategorySelectView:
            return { ...state, activeView: CategorySelect }
        default:
            return state;
    }

};