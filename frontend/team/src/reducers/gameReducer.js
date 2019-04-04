const initialState = {
    accepted: false,
    rejected: false
};
export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case "team_joinRoom":
            return {
                ...state,
                roomKey: action.roomKey,
                teamName: action.teamName
            };
        case "team_restoreSession":
            return {
                ...state,
                roomKey: action.roomKey,
                teamName: action.teamName,
                accepted: action.accepted
            };

        case "team_accepted":
            return {
                ...state,
                accepted: true
            };
        case "team_rejected":
            return {
                ...state,
                rejected: true
            };
        default:
            return {
                ...state
            };
    }
}
