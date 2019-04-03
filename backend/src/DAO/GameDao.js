import mongoose from 'mongoose'
import Game from '../models/Game';

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

    static setTeamAccepted(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, 'teams.sessionId': teamSessionId },
            {
                $set: {
                    'teams.$.accepted': true
                }
            }
        )
    }

    static removeTeam(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, 'teams.sessionId': teamSessionId },
            {
                $$pull: {
                    'teams': {'_id': teamId}
                }
            }, {new: true}, (err, doc) => console.log(err, doc)
        )
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
