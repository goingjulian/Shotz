import { viewActionTypes, messageTypes } from "./Enums";

export function viewLoginScreenAction() {
    return {
        type: viewActionTypes.VIEW_LOGINSCREEN
    };
}

export function viewMessageScreenAction(message) {
    return {
        type: viewActionTypes.VIEW_MESSAGESCREEN,
        message: message
    };
}

export function viewQuestionScreenAction() {
    return {
        type: viewActionTypes.VIEW_QUESTIONSCREEN
    };
}

export function restoreActiveScreenFromGameState(gameState, teamAccepted) {
    return dispatch => {
        switch (gameState) {
            case "REGISTER":
                teamAccepted ? dispatch(viewMessageScreenAction(messageTypes.MSG_ACCEPTED)) : dispatch(viewMessageScreenAction(messageTypes.MSG_APPROVAL));
                break;
            case "CATEGORY_SELECT":
                dispatch(viewMessageScreenAction(messageTypes.MSG_SELECTINGCATEGORIES));
                break;
            case "IN_ROUND":
                dispatch(viewQuestionScreenAction());
                break;
            case "END_ROUND":
                dispatch(viewMessageScreenAction("END ROUND!"));
                break;
            case "SUBMIT_CLOSED":
                dispatch(viewMessageScreenAction(messageTypes.MSG_SUBMITCLOSED));
                break;
            default:
                dispatch(viewLoginScreenAction());
                break;
        }
    };
}
