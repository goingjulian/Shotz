import Game from "../models/Game";
import gameStates from "../definitions/gameStates";
import ShotzException from "../exceptions/ShotzException";

export default class GameDAO {
    static addNewGame(roomKey, quizmasterId) {
        return Game.create({
            roomKey: roomKey,
            quizmaster: quizmasterId
        });
    }

    static getGameWithSessionId(sessionId) {
        return Game.findOne({
            $or: [{ quizmaster: sessionId }, { teams: { $elemMatch: { sessionId: sessionId } } }]
        });
    }

    static getGame(roomKey) {
        return Game.findOne({ roomKey: roomKey });
    }

    static deleteGame(roomKey) {
        return Game.deleteOne({ roomKey: roomKey });
    }

    static getTeam(roomKey, teamSessionId) {
        return Game.findOne({ roomKey: roomKey, "teams.sessionId": teamSessionId }, "teams.$");
    }

    static getTeams(roomKey) {
        return Game.findOne({ roomKey: roomKey }, { _id: 0, 'teams._id': 0 });
    }

    static setTeamAccepted(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, "teams.sessionId": teamSessionId, gameState: gameStates.REGISTER },
            {
                $set: {
                    "teams.$.accepted": true
                }
            }
        ).then(doc => {
            if (doc.n < 1) {
                throw new Error(`Team not found`)
            }
        })
    }

    static removeTeam(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, "teams.sessionId": teamSessionId, $or: [{ gameState: gameStates.REGISTER }, { gameState: gameStates.IN_ROUND }] },
            {
                $pull: {
                    teams: { sessionId: teamSessionId }
                }
            }
        ).then(doc => {
            console.log(doc)
            if (doc.n < 1) {
                throw new Error('Team not found or registration is closed')
            }
        })
    }

    static removeUnacceptedTeams(roomKey, quizmasterSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, quizmaster: quizmasterSessionId, gameState: gameStates.REGISTER },
            {
                $pull: {
                    teams: { accepted: false }
                }
            }
        )
    }

    static alterGameState(roomKey, quizmasterSessionId, newState) {
        return Game.updateOne(
            { roomKey: roomKey, quizmaster: quizmasterSessionId },
            { gameState: newState }
        )
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

    static addRound(roomKey, sessionId, randomQuestions, categories) {
        return Game.updateOne(
            { roomKey: roomKey, quizmaster: sessionId },
            {
                $push: {
                    rounds: {
                        categories: categories,
                        questions: randomQuestions
                    }
                }
            }
        ).then(doc => {
            if (doc.n < 1) {
                throw new ShotzException('User is not the quizmaster of this room or no room found', 400);
            }
        })
    }

    static getRounds(roomKey, sessionId) {
        return Game.findOne({ roomKey: roomKey, quizmaster: sessionId }, { rounds: 1, _id: 0 })
    }

    static goTonextQuestionInRound(roomKey, sessionId, currentRoundMongoId) {
        return Game.updateOne(
            { roomKey: roomKey, quizmaster: sessionId, rounds: { $elemMatch: { _id: currentRoundMongoId } } },
            {
                $inc: {
                    "rounds.$.activeQuestionIndex": 1
                }
            }
        )
    }

    static getCurrentQuestion(roomKey) {
        return Game.aggregate([
            { $match: { roomKey: roomKey } },
            { $project: { _id: 0, round: { $slice: ["$rounds", -1] } } }
        ])
    }

    static submitAnswer(roomKey, sessionId, questionId, answer) {
        return Game.updateOne(
            { roomKey: roomKey, "teams.sessionId": sessionId, "teams.answers.questionId": { $nin: [questionId] } },
            {
                $push: {
                    "teams.$.answers": {
                        questionId: questionId,
                        answer: answer
                    }
                }
            }
        ).then(doc => {
            if (doc.n < 1) {
                throw new ShotzException('User not found or answer already given', 400);
            }
        })
    }
}
/*

db.getCollection('games').find(
{
    roomKey: "5570",
    $and: [
        { "teams.answers.questionId": { $ne: ["5ca1e9fef13f9a4c4cc6748c"]}},
        { "teams.sessionId":  "pf2hYNkAcFUyWlNYmU2aN8p0Ie5JtoMi"}
     ]
})
*/
