export const viewActionTypes = {
    VIEW_LOBBY_SCREEN: "VIEW_LOBBY_SCREEN",
    VIEW_LOGIN_SCREEN: "VIEW_LOGIN_SCREEN",
    VIEW_CATEGORYSELECTION_SCREEN: "VIEW_CATEGORYSELECTION_SCREEN",
    VIEW_CPANEL_SCREEN: "VIEW_CPANEL_SCREEN",
    VIEW_END_ROUND_SCREEN: "VIEW_END_ROUND_SCREEN"
};

export function loginViewAction() {
    return {
        type: viewActionTypes.VIEW_LOGIN_SCREEN
    };
}

export function lobbyViewAction() {
    return {
        type: viewActionTypes.VIEW_LOBBY_SCREEN
    };
}

export function viewCategorySelectionScreen() {
    return {
        type: viewActionTypes.VIEW_CATEGORYSELECTION_SCREEN
    };
}

export function controlPanelViewAction() {
    return {
        type: viewActionTypes.VIEW_CPANEL_SCREEN
    };
}

export function viewEndRoundScreenAction() {
    return {
        type: viewActionTypes.VIEW_END_ROUND_SCREEN
    };
}

export function setViewByGameState(gameState) {
    return dispatch => {
        switch (gameState) {
            case "REGISTER":
                dispatch(lobbyViewAction());
                break;
            case "CATEGORY_SELECT":
                dispatch(viewCategorySelectionScreen());
                break;
            case "IN_ROUND":
                dispatch(controlPanelViewAction());
                break;
            case "END_ROUND":
                dispatch(viewEndRoundScreenAction());
                break;
            default:
                dispatch(loginViewAction());
                break;
        }
    };
}
