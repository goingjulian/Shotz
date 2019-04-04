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

    static getTeam(roomKey, teamSessionId) {
        return Game.findOne({ roomKey: roomKey, 'teams.sessionId': teamSessionId }, 'teams.$')
    }

    static getTeams(roomKey) {
        return Game.findOne({roomKey: roomKey}, {_id: 0, 'teams._id': 0});
    }

    static setTeamAccepted(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, 'teams.sessionId': teamSessionId, gameState: 'REGISTER' },
            {
                $set: {
                    'teams.$.accepted': true
                }
            }
        )
            .then(doc => {
                console.log(doc)
                if(doc.n < 1) {
                    console.log('doc error')
                    throw new Error(`Team not found`)
                }
            })
            .catch(err => {
                console.log(err)
                throw new Error(`Team not found`)
            })
    }

    static removeTeam(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, 'teams.sessionId': teamSessionId, gameState: 'REGISTER' },
            {
                $pull: {
                    'teams': { 'sessionId': teamSessionId }
                }
            }
        )
            .then(doc => console.log(doc))
            .catch(err => {
                throw new Error('Team not found')
            })
    }

    static joinGameAsTeam(roomKey, teamName, sessionId) {
        return Game.updateOne(
            { roomKey: roomKey },
            {
                $push: {
                    teams: {
                        teamName: teamName,
                        sessionId: sessionId,
                        accepted: false
                    }
                }
            }
        );
    }
}
