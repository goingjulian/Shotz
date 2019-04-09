import { viewActionTypes, messageTypes } from "./Enums";

export function viewLoginScreenAction() {
    return {
        type: viewActionTypes.VIEW_LOGINSCREEN
    };
}

export function viewGameScreenAction() {
    return {
        type: viewActionTypes.VIEW_GAMESCREEN
    };
}

export function restoreActiveScreenFromGameState(gameState) {
    return dispatch => {
        // switch (gameState) {
        //     case "REGISTER":
        //         teamAccepted ? dispatch(viewMessageScreenAction(messageTypes.MSG_ACCEPTED)) : dispatch(viewMessageScreenAction(messageTypes.MSG_APPROVAL));
        //         break;
        //     case "CATEGORY_SELECT":
        //         dispatch(viewMessageScreenAction(messageTypes.MSG_SELECTINGCATEGORIES));
        //         break;
        //     case "IN_ROUND":
        //         dispatch(viewQuestionScreenAction());
        //         break;
        //     case "END_ROUND":
        //         // TODO add message from state restore
        //         dispatch(viewMessageScreenAction("END ROUND!"));
        //         break;
        //     default:
        //         dispatch(viewLoginScreenAction());
        //         break;
        // }
    };
}
