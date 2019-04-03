import Game from "../models/Game";
import GameDAO from "../DAO/GameDao";
import ShotzException from "../exceptions/ShotzException";

export default class GameService {
    static async createRoom(quizmasterId) {
        try {
            const roomKey = await this._generateUniqueRoomKey();
            await GameDAO.addNewGame(roomKey, quizmasterId);
            return roomKey;
        } catch (err) {
            console.log(err);
            throw new ShotzException("Error occured when trying to create a new game!");
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
            console.log(`Error: ${err.message}`);
            throw new ShotzException("Unable to join room!", 500);
        }
    }

    static async restoreSession(roomKey, loginRole, sessionId) {
        try {
            const game = await GameDAO.getGame(roomKey).lean(); //Makes it a JS obj
            game.teams = [...game.teams];

            if (game && game.quizmaster === sessionId && loginRole === "Quizmaster") {
                return {
                    type: "quizmaster_restoreSession",
                    roomKey: roomKey,
                    gameState: game.gameState,
                    teams: game.teams
                };
            } else if (game && game.teams.find(team => team.sessionId === sessionId) && loginRole === "Team") {
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
            throw err;
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
        const game = await GameDAO.getGame(roomKey).lean();
        console.log(game);
        return game.teams;
    }

    static async getQuizmaster(roomKey) {
        const game = await GameDAO.getGame(roomKey);
        return game.quizmaster;
    }

    static async alterTeamAcceptedStatus(roomKey, teamSessionId, accepted) {
        console.log("Setting team state")
        console.log("ts", teamSessionId)

        console.log("accept == ", accepted)

        try {
            if(accepted) {
                await GameDAO.setTeamAccepted(roomKey, teamSessionId)
            } else if(accepted === false) {
                await GameDAO.removeTeam(roomKey, teamSessionId)
            }
        } catch(err) {
            throw new Error("Team not found")
        }

        
        

    }
}
