export default function gameReducer(state = {}, action) {
    switch (action.type) {
        case "player_joinRoom":
            return {
                ...state,
                roomKey: action.roomKey,
                teamName: action.teamName
            };
        case "player_restoreSession":
            return {
                ...state,
                roomKey: action.roomKey,
                teamName: action.teamName,
                accepted: action.accepted
            };
        default:
            return state;
    }
}
