import Game from '../models/Game';
import gameStates from '../definitions/gameStates'

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
        return Game.findOne({ roomKey: roomKey }, { _id: 0, 'teams._id': 0 });
    }

    static setTeamAccepted(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, 'teams.sessionId': teamSessionId, gameState: gameStates.REGISTER },
            {
                $set: {
                    'teams.$.accepted': true
                }
            }
        )
            .then(doc => {
                console.log(doc)
                if (doc.n < 1) {
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
            { roomKey: roomKey, 'teams.sessionId': teamSessionId, gameState: gameStates.REGISTER },
            {
                $pull: {
                    'teams': { 'sessionId': teamSessionId }
                }
            }
        )
            .then(doc => {
                console.log(doc)
                if (doc.n < 1) {
                    throw new Error('Team not found')
                }
            })
            .catch(err => {
                throw new Error('Team not found')
            })
    }

    static removeUnacceptedTeams(roomKey, quizmasterSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, quizmaster: quizmasterSessionId, gameState: gameStates.REGISTER },
            {
                $pull: {
                    'teams': { 'accepted': false }
                }
            }
        )
            .then(doc => {
                console.log(doc)
                return "Success"
            })
            .catch(err => {
                throw new Error('Not authorized or invalid roomKey')
            })
    }

    static alterGameState(roomKey, quizmasterSessionId, newState) {
        return Game.updateOne(
            { roomKey: roomKey, quizmaster: quizmasterSessionId },
            { gameState: newState }
        )
            .then(doc => {
                console.log(doc)
                return "success"
            })
            .catch(err => {
                throw new Error('Error gamestate')
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

    static addRound(roomKey, sessionId, chosenQuestions, categories) {
        console.log(sessionId)
        return Game.updateOne(
            { roomKey: roomKey, quizmaster: sessionId },
            {
                $push: {
                    rounds: {
                        categories: categories,
                        questions: chosenQuestions
                    }
                }
            }
        )
            .then(doc => {
                console.log(doc)
                if(doc.n < 1) {
                    throw new Error('User not authorized')
                }
                return {
                    categories: categories,
                    questions: chosenQuestions
                }
            })
    }
}
