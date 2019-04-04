import environment from '../environments/environment'
import { setViewByGameState } from './viewActions'
import { initSocket } from '../helpers/websocketHelper'
import { setTeams } from './teamActions'

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

            const body = await response.json()

            dispatch(createRoomAction(body.roomKey))
            dispatch(setViewByGameState(body.gameState))
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
                method: "post",
                body: JSON.stringify({role: 'Quizmaster'}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const parsedRes = await response.json()

                dispatch(setTeams(parsedRes.teams));
                dispatch(createRoomAction(parsedRes.roomKey));
                dispatch(setViewByGameState(parsedRes.gameState));
            }
        } catch (error) {
            console.log("No saved session")
        }
        dispatch(initSocket())
    }
}