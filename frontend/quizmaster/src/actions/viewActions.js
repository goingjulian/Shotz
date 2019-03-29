
export const viewActionTypes = {
    LobbyView: "LobbyView",
    LoginView: "LoginView",
    CategorySelectView: "CategorySelectView"
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