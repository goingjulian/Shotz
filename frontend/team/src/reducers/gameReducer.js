const initialState = {
  roomKey: null,
  teamName: null,
  accepted: false,
  rejected: false,
  question: null,
  error: ''
};
export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_ERROR':
      return { ...state, error: action.error };
    case 'REMOVE_ERROR':
      return { ...state, error: '' };
    case 'team_joinRoom':
      return {
        ...state,
        roomKey: action.roomKey,
        teamName: action.teamName
      };
    case 'team_restoreSession':
      return {
        ...state,
        roomKey: action.roomKey,
        teamName: action.teamName,
        accepted: action.accepted,
        question: action.question
      };

    case 'team_accepted':
      return {
        ...state,
        accepted: true
      };
    case 'team_rejected':
      return {
        ...initialState,
        rejected: true
      };
    case 'team_leaveRoom':
      return {
        ...initialState
      };
    case 'team_setQuestion':
      return {
        ...state,
        question: action.question
      };
    default:
      return {
        ...state
      };
  }
}
