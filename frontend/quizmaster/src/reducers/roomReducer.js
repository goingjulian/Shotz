import { roomActionTypes } from "../actions/roomActions";

const initialRoomState = {
    roomKey: null
};

export default function roomReducer(state = initialRoomState, action) {
    switch (action.type) {
        case roomActionTypes.CREATE_ROOM:
            return { ...state, roomKey: action.roomKey };
        case roomActionTypes.LEAVE_ROOM:
            return { ...initialRoomState };
        default:
            return state;
    }
}
