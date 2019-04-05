
export const viewActionTypes = {
    LobbyView: "LobbyView",
    LoginView: "LoginView",
    CategorySelectView: "CategorySelectView",
    ControlPanelView: "ControlPanelView"
}

export function lobbyViewAction() {
    return {
        type: viewActionTypes.LobbyView
    }
}

export function loginViewAction() {
    return {
        type: viewActionTypes.LoginView
    }
}

export function categorySelectViewAction() {
    return {
        type: viewActionTypes.CategorySelectView
    }
}

export function controlPanelViewAction() {
    return {
        type: viewActionTypes.ControlPanelView
    }
}

export function setViewByGameState(gameState) {
    return async dispatch => {
        console.log("state = ", gameState)
        switch (gameState) {
            case "REGISTER":
                dispatch(lobbyViewAction())
                break;
            case "CATEGORY_SELECT":
                dispatch(categorySelectViewAction())
                break;
            case "IN_ROUND":
                dispatch(controlPanelViewAction())
                break;
            default:
                dispatch(loginViewAction())
                break;
        }
    }
}