import environment from '../environments/environment'
import { lobbyViewAction } from './viewActions'
import { initSocket } from '../helpers/websocketHelper'

export const roomActionTypes = {
    createRoom: " createRoom"
}

export function createRoomAction(roomKey) {
    return {
        type: roomActionTypes.createRoom,
        roomKey: roomKey
    }
}

export function createRoom() {
    return async dispatch => {
        try {
            const response = await fetch(`${environment.API_URL}/room`, {
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

export function restoreRoomState() {
    return async dispatch => {
        try {
            const response = await fetch(`${environment.API_URL}/room/restore`, {
                credentials: 'include',
                mode: 'cors',
                method: "post"
            })

            if (response.ok) {
                const parsedRes = await response.json()

                //dispatch(addMultipleTeams(parsedRes.teams));
                dispatch(createRoomAction(parsedRes.roomKey))
                dispatch(lobbyViewAction())
                
            }
        } catch (error) {
            // console.log(error)
            console.log("No saved session")
        }
        dispatch(initSocket())
    }
}