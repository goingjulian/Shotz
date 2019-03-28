
export const viewActionTypes = {
    LobbyView: "LobbyView",
    LoginView: "LoginView"
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