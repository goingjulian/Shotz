import Game from "../models/Game";

export default class GameDAO {

    async  _addNewGame(roomCode, quizmasterId) {
        return Game.create({
            roomKey: roomCode,
            quizmaster: quizmasterId
        })
    }
}