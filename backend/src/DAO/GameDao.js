import Game from '../models/Game';
import { session } from 'express-session';

export default class GameDAO {
    static addNewGame(roomKey, quizmasterId) {
        return Game.create({
            roomKey: roomKey,
            quizmaster: quizmasterId
        });
    }

    static getGame(roomKey) {
        return Game.findOne({ roomKey: roomKey });
    }

    static joinGameAsTeam(roomKey, teamName, sessionId) {
        return Game.updateOne(
            { roomKey: roomKey },
            {
                $push: {
                    teams: {
                        name: teamName,
                        sessionId: sessionId,
                        accepted: false
                    }
                }
            }
        );
    }
}
