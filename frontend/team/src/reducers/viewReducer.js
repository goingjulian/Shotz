import Login from "../components/Login/Login.jsx";
import Message from "../components/Message/Message.jsx";
import Question from "../components/Question/Question";
import { viewActionTypes } from "../actions/Enums.js";

const initalViewState = {
    activeView: Login,
    messageScreenText: 'If you see this, something went wrong!'
};

export default function viewReducer(state = initalViewState, action) {
    switch (action.type) {
        case viewActionTypes.VIEW_LOGINSCREEN:
            return { ...state, activeView: Login };
        case viewActionTypes.VIEW_MESSAGESCREEN:
            return { ...state, activeView: Message, messageScreenText: action.message };
        case viewActionTypes.VIEW_QUESTIONSCREEN:
            return { ...state, activeView: Question };
        default:
            return state;
    }
}
