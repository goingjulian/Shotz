const initialState = {
    roomKey: null,
    teamName: null,
    accepted: false,
    rejected: false,
    question: null
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
                accepted: action.accepted,
                question: action.question
            };

        case "team_accepted":
            return {
                ...state,
                accepted: true
            };
        case "team_rejected":
            return {
                ...initialState,
                rejected: true
            };
        case "team_leaveRoom":
            return {
                ...initialState
            };
        case "team_setQuestion":
            return {
                ...state,
                question: action.question
            }
        default:
            return {
                ...state
            };
    }
}
