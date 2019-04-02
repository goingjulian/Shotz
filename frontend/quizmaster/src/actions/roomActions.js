import environment from '../environments/environment'
import { lobbyViewAction } from './viewActions'

export const roomActionTypes = {
    createRoom: " createRoom"
}

function createRoomAction(roomKey) {
    return {
        type: roomActionTypes.createRoom,
        roomKey: roomKey
    }
}

export function createRoom() {
    return async dispatch => {
        try {
            const response = await fetch(`http://${environment.baseUrl}/room`, {
                credentials: 'include',
                mode: 'cors',
                method: "post"
            })

            const parsedRes = await response.json()

            const roomKey = parsedRes.roomKey

            console.log("ROOMKEY IS " + roomKey)

            dispatch(createRoomAction(roomKey))
            dispatch(lobbyViewAction())
        } catch (error) {
            console.log(error)
        }
    }
}