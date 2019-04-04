import Game from "../models/Game";
import gameStates from "../definitions/gameStates";

export default class GameDAO {
    static addNewGame(roomKey, quizmasterId) {
        return Game.create({
            roomKey: roomKey,
            quizmaster: quizmasterId
        });
    }

    static getGameWithSessionId(sessionId) {
        return Game.findOne({
            $or: [
                { quizmaster: sessionId },
                { teams: { $elemMatch: { sessionId: sessionId } } }
            ]
        });
    }

    static getGame(roomKey) {
        return Game.findOne({ roomKey: roomKey });
    }

    static getTeam(roomKey, teamSessionId) {
        return Game.findOne({ roomKey: roomKey, "teams.sessionId": teamSessionId }, "teams.$");
    }

    static getTeams(roomKey) {
        return Game.findOne({ roomKey: roomKey }, { _id: 0, "teams._id": 0 });
    }

    static setTeamAccepted(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, "teams.sessionId": teamSessionId, gameState: gameStates.REGISTER },
            {
                $set: {
                    "teams.$.accepted": true
                }
            }
        )
            .then(doc => {
                if (doc.n < 1) {
                    console.log("doc error");
                    throw new Error(`Team not found`);
                }
            })
            .catch(err => {
                throw new Error(`Team not found`);
            });
    }

    static removeTeam(roomKey, teamSessionId) {
        return Game.updateOne(
            { roomKey: roomKey, "teams.sessionId": teamSessionId, gameState: gameStates.REGISTER },
            {
                $pull: {
                    teams: { sessionId: teamSessionId }
                }
            }
        )
            .then(doc => {
                if (doc.n < 1) {
                    throw new Error("Team not found");
                }
            })
            .catch(err => {
                throw new Error("Team not found");
            });
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
            .then(doc => {
                console.log(doc);
                if (doc.n < 1) throw new Error("Not authorized or invalid roomKey");
                return "Success";
            })
            .catch(err => {
                throw new Error("Not authorized or invalid roomKey");
            });
    }

    static alterGameState(roomKey, quizmasterSessionId, newState) {
        return Game.updateOne({ roomKey: roomKey, quizmaster: quizmasterSessionId }, { gameState: newState })
            .then(doc => {
                console.log(doc);
                return "success";
            })
            .catch(err => {
                throw new Error("Error gamestate");
            });
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
