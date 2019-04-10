import { roomActionTypes } from "../actions/roomActions";

const initialRoomState = {
  roomKey: null,
  error: ""
};

export default function roomReducer(state = initialRoomState, action) {
  switch (action.type) {
    case roomActionTypes.CREATE_ROOM:
      return { ...state, roomKey: action.roomKey };
    case roomActionTypes.LEAVE_ROOM:
      return { ...initialRoomState };
    case roomActionTypes.ADD_ERROR:
      return { ...state, error: action.error };
    case roomActionTypes.REMOVE_ERROR:
      return { ...state, error: "" };
    default:
      return state;
  }
}
