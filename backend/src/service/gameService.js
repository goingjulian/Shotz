import Game from "../models/Game";
import GameDAO from "../DAO/GameDao";
import QuestionDAO from '../DAO/QuestionDao'
import ShotzException from "../exceptions/ShotzException";
import gameStates from '../definitions/gameStates'

export default class GameService {
    static async createRoom(quizmasterId) {
        try {
            const roomKey = await this._generateUniqueRoomKey();
            await GameDAO.addNewGame(roomKey, quizmasterId);
            return roomKey;
        } catch (err) {
            console.log(`createRoom error: ${err.message}`);
            throw new ShotzException("Error occured when trying to create a new game");
        }
    }

    static async joinRoom(roomKey, teamName, sessionId) {
        try {
            const game = await GameDAO.getGame(roomKey).lean();
            if (!game) {
                throw new ShotzException(`There was no room found with room key ${roomKey}`, 404);
            } else if (game.gameState !== "REGISTER") {
                throw new ShotzException("Registration is closed for this quiz", 403);
            } else if (game.quizmaster === sessionId || game.teams.find(team => team.sessionId === sessionId)) {
                throw new ShotzException("You have already joined this quiz!", 403);
            } else {
                await GameDAO.joinGameAsTeam(roomKey, teamName, sessionId);
                return {
                    type: "team_joinRoom",
                    roomKey: roomKey,
                    teamName: teamName
                };
            }
        } catch (err) {
            console.log(`joinRoom error: ${err.message}`);
            throw new ShotzException(err.message, 500);
        }
    }

    static async restoreSession(roomKey, loginRole, sessionId) {
        try {
            const game = await GameDAO.getGame(roomKey).lean();
            if (game) game.teams = [...game.teams];
            if (game && game.quizmaster === sessionId && loginRole === "Quizmaster") {
                return {
                    type: "quizmaster_restoreSession",
                    roomKey: roomKey,
                    gameState: game.gameState,
                    teams: game.teams
                };
            } else if (
                game &&
                game.teams.length > 0 &&
                game.teams.find(team => team.sessionId === sessionId) &&
                loginRole === "Team"
            ) {
                const team = game.teams.find(team => team.sessionId === sessionId);
                return {
                    type: "team_restoreSession",
                    roomKey: roomKey,
                    gameState: game.gameState,
                    teamName: team.teamName,
                    accepted: team.accepted
                };
            } else {
                throw new ShotzException("No active sessions found for your role!", 404);
            }
        } catch (err) {
            console.log(`restoreSession error: ${err.message}`);
            if (!err.hhtmlErrorCode) {
                throw new ShotzException(err.message, 500);
            } else {
                throw err;
            }
        }
    }

    static async _generateUniqueRoomKey() {
        let roomKey = null;
        let isUnique = false;

        while (!isUnique) {
            roomKey = Math.floor(1000 + Math.random() * 9000);

            let keyExists;
            try {
                keyExists = await Game.findOne({ roomKey: roomKey });
            } catch (err) {
                console.log("ERROR", err);
            }

            if (!keyExists) {
                isUnique = true;
            }
        }
        return roomKey;
    }

    static async getTeams(roomKey) {
        const teams = await GameDAO.getTeams(roomKey).lean();
        return teams.teams;
    }

    static async getQuizmaster(roomKey) {
        try {
            const game = await GameDAO.getGame(roomKey);
            return game.quizmaster;
        } catch (error) {
            throw new ShotzException("An error occured, please check the roomKey and sessionId", 404);
        }
    }

    static async alterTeamAcceptedStatus(roomKey, teamSessionId, accepted) {
        try {
            if (accepted) {
                await GameDAO.setTeamAccepted(roomKey, teamSessionId);
                return "team accepted";
            } else if (accepted === false) {
                await GameDAO.removeTeam(roomKey, teamSessionId);
                return "Team rejected";
            }
        } catch (err) {
            console.log(err);
            throw new ShotzException("Team not found", 404);
        }
    }

    static async removeUnacceptedTeams(roomKey, quizmasterSessionId) {
        try {
            await GameDAO.removeUnacceptedTeams(roomKey, quizmasterSessionId)
            await GameDAO.alterGameState(roomKey, quizmasterSessionId, gameStates.CATEGORY_SELECT)
            return await this.getTeams(roomKey)
        } catch (err) {
            console.log(err)
            throw new ShotzException(`Error, ${err}`, 500)
        }
    }

    static async startNewRound(roomKey, sessionId, categories) {
        try {
            const allQuestions = await QuestionDAO.getAllQuestionsByCategories(categories);

            const chosenQuestions = this.pickRandomquestionsFromList(allQuestions, 12);

            const round = await GameDAO.addRound(roomKey, sessionId, chosenQuestions, categories);

            await GameDAO.alterGameState(roomKey, sessionId, gameStates.IN_ROUND);

            return {
                gameState: gameStates.IN_ROUND,
                round: round
            };
        } catch (err) {
            throw new ShotzException(err.message, 401);
        }
    }

    static pickRandomquestionsFromList(questions, amount) {
        const chosenQuestions = []
        const questionAmount = questions.length > amount ? amount : questions.length

        for (let i = 0; i < questionAmount; i++) {
            const randomNumber = Math.floor(Math.random() * questions.length);
            const questionAlreadyPicked = chosenQuestions.find(question => question._id === questions[randomNumber]._id);

            if (!questionAlreadyPicked) {
                chosenQuestions.push(questions[randomNumber]);
            } else {
                console.log("Duplicate number!")
                i--;
            }
        }

        return chosenQuestions;
    }
}
