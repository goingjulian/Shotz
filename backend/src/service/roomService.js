import GameDAO from '../DAO/GameDao';

import ShotzException from '../exceptions/ShotzException';
import roles from '../definitions/roles';
import gameStates from '../definitions/gameStates';

import GameService from './gameService';
import { sendMessageTeam, closeConnection, sendMessageQuizmaster, sendMessageTeams, sendMessageScoreBoards } from "./websocketService";


export default class RoomService {
  /**
   * Quizmaster creates a room
   */
  static async createRoom(quizmasterId) {
    try {
      const roomKey = await this._generateUniqueRoomKey();
      await GameDAO.addNewGame(roomKey, quizmasterId);
      return {
        roomKey: roomKey
      };
    } catch (err) {
      throw new ShotzException('Server error occured when trying to create a new room!');
    }
  }

  /**
   * Join a room as a team
   */
  static async joinRoom(roomKey, teamName, sessionId) {
    try {
      const game = await GameDAO.getGame(roomKey).lean();

      if (typeof teamName !== 'string') {
        throw new ShotzException('Invalid format: teamName must be a string', 400);
      } else if (!game) {
        throw new ShotzException(`There was no room found with room key ${roomKey}`, 404);
      } else if (game.gameState !== gameStates.REGISTER) {
        throw new ShotzException('Registration is closed for this quiz', 403);
      } else if (game.teams.find(team => team.teamName === teamName)) {
        throw new ShotzException(`There is a already a team with the name ${teamName}!`, 403);
      } else {
        await GameDAO.joinGameAsTeam(roomKey, teamName, sessionId);
        sendMessageQuizmaster(roomKey, { type: 'quizmaster_newTeam' });
        return {
          roomKey: roomKey,
          teamName: teamName
        };
      }
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * Join a room as a scoreboard
   */
  static async joinRoomScoreboard(roomKey, sessionId) {
    try {
      const game = await GameDAO.getGame(roomKey).lean();
      if (!game) {
        throw new ShotzException(`There was no room found with room key ${roomKey}`, 404);
      } else {
        await GameDAO.joinGameAsScoreBoard(roomKey, sessionId);
        return {
          type: 'scoreB_joinRound',
          roomKey: roomKey,
          gameState: game.gameState,
          currentRound: game.rounds.length,
          currentQuestionIndex:
            game.rounds.length > 0 ? game.rounds[game.rounds.length - 1].activeQuestionIndex : 0,
          teams: game.teams
        };
      }
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * Leave a game
   */
  static async leaveRoom(roomKey, sessionId) {
    try {
      const game = await GameDAO.getGame(roomKey).lean();
      if (game) game.teams = [...game.teams];
      if (game.quizmaster === sessionId) {
        await RoomService._quizmasterLeaveGame(game, roomKey, sessionId);
      } else if (game.teams.find(team => team.sessionId === sessionId)) {
        await RoomService._teamLeaveGame(game, roomKey, sessionId);
      }
      return;
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * Restore a session
   */
  static async restoreSession(roomKey, loginRole, sessionId) {
    try {
      if (typeof loginRole !== 'string')
        throw new ShotzException('Invalid format: role must be a string', 400);

      const game = await GameDAO.getGame(roomKey).lean();
      if (game) game.teams = [...game.teams];
      if (game && game.quizmaster === sessionId && loginRole === roles.ROLE_QUIZMASTER) {
        return {
          type: 'quizmaster_restoreSession',
          roomKey: roomKey,
          gameState: game.gameState,
          teams: game.teams,
          rounds: game.rounds,
          currentQuestionIndex:
            game.rounds.length > 0 ? game.rounds[game.rounds.length - 1].activeQuestionIndex : 0
        };
      } else if (
        game &&
        game.teams.length > 0 &&
        game.teams.find(team => team.sessionId === sessionId) &&
        loginRole === roles.ROLE_TEAM
      ) {
        const team = game.teams.find(team => team.sessionId === sessionId);
        const currentQuestion = await GameService.getCurrentQuestion(roomKey);
        return {
          type: 'team_restoreSession',
          roomKey: roomKey,
          gameState: game.gameState,
          teamName: team.teamName,
          accepted: team.accepted,
          question: currentQuestion
        };
      } else if (
        game &&
        game.scoreboards.length > 0 &&
        game.scoreboards.find(scoreboard => scoreboard === sessionId) &&
        loginRole === roles.ROLE_SCOREBOARD
      ) {
        return {
          type: 'scoreB_restoreSession',
          roomKey: roomKey,
          gameState: game.gameState,
          currentRound: game.rounds.length,
          currentQuestionIndex:
            game.rounds.length > 0 ? game.rounds[game.rounds.length - 1].activeQuestionIndex : 0,
          teams: game.teams
        };
      } else {
        throw new ShotzException('No active sessions found for your role!', 404);
      }
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * Get array of teams of a room
   */
  static async getTeams(roomKey) {
    try {
      const teams = await GameDAO.getTeams(roomKey).lean();
      return teams.teams;
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * PRIVATE - Generating unique roomkey for a new room
   */
  static async _generateUniqueRoomKey() {
    let roomKey = null;
    let isUnique = false;
    while (!isUnique) {
      roomKey = Math.floor(1000 + Math.random() * 9000);
      let keyExists;
      try {
        keyExists = await GameDAO.getGame(roomKey);
      } catch (err) {
        throw err;
      }

      if (!keyExists) {
        isUnique = true;
      }
    }
    return roomKey;
  }

  static async _quizmasterLeaveGame(game, roomKey, quizmasterId) {
    // Send scores to all teams
    const scores = await GameDAO.getScores(roomKey);
    sendMessageTeams(roomKey, {
      type: 'team_quizmasterLeft',
      scores: scores
    });
    sendMessageScoreBoards(roomKey, {
      type: 'scoreB_quizmasterLeft',
      scores: scores
    });

    // Close all websocket connecitons
    game.teams.forEach(team => {
      closeConnection(team.sessionId);
    });
    game.scoreboards.forEach(scoreboard => {
      closeConnection(scoreboard);
    });
    closeConnection(quizmasterId);

    // Delete game from database
    GameDAO.deleteGame(roomKey);
  }

  static async _teamLeaveGame(game, roomKey, quizmasterId) {
    // Send messages to quizmaster and scoreboards
    sendMessageQuizmaster(roomKey, {
      type: 'quizmaster_teamLeft',
      sessionId: sessionId
    });
    sendMessageScoreBoards(roomKey, {
      type: 'scoreB_teamLeft',
      sessionId: sessionId
    });

    // Remove team and close their connection
    GameDAO.removeTeam(roomKey, sessionId);
    closeConnection(sessionId);
  }
}
