import Game from "../models/Game";
import GameDAO from "../DAO/GameDao";
import QuestionDAO from '../DAO/QuestionDao'
import ShotzException from "../exceptions/ShotzException";
import gameStates from "../definitions/gameStates";
import { sendMessageTeam, closeConnection, sendMessageQuizmaster, sendMessageTeams } from "./websocketService";

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
            if (typeof teamName !== "string") throw new ShotzException("Invalid format: teamName must be a string", 400);

            const game = await GameDAO.getGame(roomKey).lean();
            if (!game) {
                throw new ShotzException(`There was no room found with room key ${roomKey}`, 404);
            } else if (game.gameState !== "REGISTER") {
                throw new ShotzException("Registration is closed for this quiz", 403);
            } else if (game.quizmaster === sessionId || game.teams.find(team => team.sessionId === sessionId)) {
                throw new ShotzException("You have already joined this quiz!", 403);
            } else if (game.teams.find(team => team.teamName === teamName)) {
                throw new ShotzException(`There is a already a team with the name ${teamName}!`, 403);
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
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }

    static async restoreSession(roomKey, loginRole, sessionId) {
        try {
            if (typeof loginRole !== "string") throw new ShotzException("Invalid format: role must be a string", 400);

            const game = await GameDAO.getGame(roomKey).lean();
            if (game) game.teams = [...game.teams];
            if (game && game.quizmaster === sessionId && loginRole === "Quizmaster") {
                return {
                    type: "quizmaster_restoreSession",
                    roomKey: roomKey,
                    gameState: game.gameState,
                    teams: game.teams,
                    rounds: game.rounds,
                    currentQuestionIndex: game.rounds.length > 0 ? game.rounds[game.rounds.length - 1].activeQuestionIndex : 0
                };
            } else if (
                game &&
                game.teams.length > 0 &&
                game.teams.find(team => team.sessionId === sessionId) &&
                loginRole === "Team"
            ) {
                const team = game.teams.find(team => team.sessionId === sessionId);
                const currentQuestion = await this.getCurrentQuestion(roomKey);
                return {
                    type: "team_restoreSession",
                    roomKey: roomKey,
                    gameState: game.gameState,
                    teamName: team.teamName,
                    accepted: team.accepted,
                    question: currentQuestion
                };
            } else {
                throw new ShotzException("No active sessions found for your role!", 404);
            }
        } catch (err) {
            console.log(`restoreSession error: ${err.message}`);
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
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
        try {
            const teams = await GameDAO.getTeams(roomKey).lean();
            return teams.teams;
        } catch (err) {
            console.log(`getTeams error: ${err.message}`);
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }

    static async getQuizmaster(roomKey) {
        try {
            const game = await GameDAO.getGame(roomKey);
            return game.quizmaster;
        } catch (err) {
            throw new ShotzException("An error occured, please check the roomKey and sessionId", 404);
        }
    }

    static async leaveGame(roomKey, sessionId) {
        try {
            const game = await GameDAO.getGame(roomKey).lean();
            if (game) game.teams = [...game.teams];
            if (game.quizmaster === sessionId) {
                await sendMessageTeams(roomKey, {
                    type: "team_quizmasterLeft"
                });
                game.teams.forEach(team => {
                    closeConnection(team.sessionId);
                });
                closeConnection(sessionId);
                await GameDAO.deleteGame(roomKey);
                return {
                    type: "quizmaster_leftGame"
                };
            } else if (game.teams.find(team => team.sessionId === sessionId)) {
                GameDAO.removeTeam(roomKey, sessionId);
                closeConnection(sessionId);
                sendMessageQuizmaster(roomKey, {
                    type: "quizmaster_teamLeft",
                    sessionId: sessionId
                });
                return {
                    type: "team_leftGame"
                };
            } else {
                throw new ShotzException(`You already were removed or we're unable to remove you from the game ${roomKey}!`, 500);
            }
        } catch (err) {
            console.log(`leaveGame error: ${err.message}`);
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }

    static async alterTeamStatus(roomKey, sessionId, accepted) {
        try {
            if (typeof accepted !== "boolean") throw new ShotzException("Invalid format: accepted must be a boolean", 400);

            if (accepted) {
                await GameDAO.setTeamAccepted(roomKey, sessionId);
                sendMessageTeam(roomKey, sessionId, {
                    type: "team_accepted"
                });
                return {
                    type: "quizmaster_teamAccepted",
                    sessionId: sessionId
                };
            } else {
                await GameDAO.removeTeam(roomKey, sessionId);
                sendMessageTeam(roomKey, sessionId, {
                    type: "team_rejected"
                });
                closeConnection(sessionId);
                return {
                    type: "quizmaster_teamRejected",
                    sessionId: sessionId
                };
            }
        } catch (err) {
            console.log(`alterTeamStatus error: ${err.message}`);
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }

    static async removeUnacceptedTeams(roomKey, quizmasterSessionId) {
        try {
            const teams = await this.getTeams(roomKey);
            const rejectedTeams = teams.filter(team => team.accepted === false);
            const acceptedTeams = teams.filter(team => team.accepted === true);
            await GameDAO.removeUnacceptedTeams(roomKey, quizmasterSessionId);
            await GameDAO.alterGameState(roomKey, quizmasterSessionId, gameStates.CATEGORY_SELECT);

            rejectedTeams.forEach(team => {
                sendMessageTeam(roomKey, team.sessionId, {
                    type: "team_rejected"
                });
            })

            return await acceptedTeams;
        } catch (err) {
            console.log(err);
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }

    static async startNewRound(roomKey, sessionId, categories) {
        try {
            if (!Array.isArray(categories)) {
                throw new ShotzException('Invalid format: the chosen categories have to be in an array', 400);
            }
            if (categories.length < 1 || categories.length > 3) {
                throw new ShotzException('Invalid length: you need at leat 1 and max 3 categories to start a round', 400);
            }

            const allQuestions = await QuestionDAO.getAllQuestionsByCategories(categories);

            const chosenQuestions = this.pickRandomquestionsFromList(allQuestions, 12);

            await GameDAO.addRound(roomKey, sessionId, chosenQuestions, categories);

            await GameDAO.alterGameState(roomKey, sessionId, gameStates.IN_ROUND);

            const rounds = await GameDAO.getRounds(roomKey, sessionId).lean();

            return {
                gameState: gameStates.IN_ROUND,
                rounds: rounds.rounds,
                currentQuestionIndex: rounds.rounds.length > 0 ? rounds.rounds[rounds.rounds.length - 1].activeQuestionIndex : 0 //This doesn't go well when you start a new round
            };
        } catch (err) {
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
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

    static async goTonextQuestionInRound(roomKey, sessionId) {
        try {
            const rounds = await GameDAO.getRounds(roomKey, sessionId).lean();

            if (!rounds) throw new ShotzException(`Error while proceeding to next question, roomKey invalid or not authorized`, 400);

            const currentRound = rounds.rounds[rounds.rounds.length - 1];

            if (currentRound.questions.length <= currentRound.activeQuestionIndex + 1) throw new ShotzException('Last question reached', 400);

            await GameDAO.goTonextQuestionInRound(roomKey, sessionId, currentRound._id);
            return { activeQuestionIndex: currentRound.activeQuestionIndex + 1 };
        } catch (err) {
            console.log(err)
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }

    static async getCurrentQuestion(roomKey) {
        try {
            const result = await GameDAO.getCurrentQuestion(roomKey);
            if (!result || result.length < 1) throw new ShotzException(`RoomKey not found`, 400);

            if (result[0].round.length < 1) {
                return {
                    question: null,
                    category: null
                }
            }
            
            const currentRound = result[0].round[0];
            const currentQuestion = currentRound.questions[currentRound.activeQuestionIndex];
            return {
                questionId: currentQuestion._id,
                question: currentQuestion.question,
                category: currentQuestion.category
            };
        } catch (err) {
            console.log(err)
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }

    static async submitAnswer(roomKey, sessionId, questionId, answer) {
        try {
            await GameDAO.submitAnswer(roomKey, sessionId, questionId, answer);
            return {
                success: "answer submitted"
            }
        } catch(err) {
            console.log(err)
            if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
            else throw err;
        }
    }
}
