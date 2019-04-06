export const viewActionTypes = {
    VIEW_LOBBY: 1,
    VIEW_WAITINGSCREEN: 2,
    VIEW_QUESTIONSCREEN: 3
};

export function viewLobbyAction() {
    return {
        type: viewActionTypes.VIEW_LOBBY
    };
}

export function viewWaitingscreenAction() {
    return {
        type: viewActionTypes.VIEW_WAITINGSCREEN
    };
}

export function viewQuestionScreenAction() {
    return {
        type: viewActionTypes.VIEW_QUESTIONSCREEN
    };
}

export function restoreActiveScreenFromGameState(gameState) {
    return dispatch => {
        switch (gameState) {
            case "REGISTER":
                dispatch(viewWaitingscreenAction());
                break;
            default:
                dispatch(viewLobbyAction());
                break;
        }
    };
}
