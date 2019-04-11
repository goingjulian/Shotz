import GameDAO from '../DAO/GameDao';
import SessionDAO from '../DAO/SessionDAO';

import QuestionService from './questionService';

import ShotzException from '../exceptions/ShotzException';
import roles from '../definitions/roles';
import gameStates from '../definitions/gameStates';

import {
  sendMessageTeam,
  closeConnection,
  sendMessageQuizmaster,
  sendMessageTeams,
  sendMessageScoreBoards
} from './websocketService';

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
  static async joinRoomScoreboard(roomKey, scoreboardId) {
    try {
      const game = await GameDAO.getGame(roomKey).lean();
      if (!game) {
        throw new ShotzException(`There was no room found with room key ${roomKey}`, 404);
      } else {
        await GameDAO.joinGameAsScoreBoard(roomKey, scoreboardId);
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
        await this._quizmasterLeaveRoom(game, roomKey, sessionId);
      } else if (game.teams.find(team => team.sessionId === sessionId)) {
        await this._teamLeaveRoom(game, roomKey, sessionId);
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
  static async restoreSession(roomKey, role, sessionId) {
    try {
      const game = await GameDAO.getGame(roomKey).lean();
      if (game) game.teams = [...game.teams];

      if (typeof role !== 'string') {
        throw new ShotzException('Invalid format: role must be a string', 400);
      } else if (!game) {
        throw new ShotzException(`There was no room found with room key ${roomKey}`, 404);
      } else if (game.quizmaster === sessionId && role === roles.ROLE_QUIZMASTER) {
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
        game.teams.some(team => team.sessionId === sessionId) &&
        role === roles.ROLE_TEAM
      ) {
        const team = game.teams.find(team => team.sessionId === sessionId);
        const currentQuestion = await QuestionService.getCurrentQuestion(roomKey);
        return {
          type: 'team_restoreSession',
          roomKey: roomKey,
          gameState: game.gameState,
          teamName: team.teamName,
          accepted: team.accepted,
          question: currentQuestion
        };
      } else if (
        game.scoreboards.some(scoreboard => scoreboard === sessionId) &&
        role === roles.ROLE_SCOREBOARD
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
   * Get array of teams from a room
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
   * Get array of scores of a team from a room
   */
  static async getScores(roomKey) {
    try {
      return await GameDAO.getScores(roomKey);
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * Delete all unaccepted teams from a room
   */
  static async removeUnacceptedTeams(roomKey) {
    try {
      const teams = await this.getTeams(roomKey);
      const rejectedTeams = teams.filter(team => team.accepted === false);
      const acceptedTeams = teams.filter(team => team.accepted === true);
      await GameDAO.removeUnacceptedTeams(roomKey);
      rejectedTeams.forEach(async team => {
        await sendMessageTeam(roomKey, team.sessionId, {
          type: 'team_rejected'
        });
        closeConnection(team.sessionId);
      });

      return await acceptedTeams;
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * Change the accepted or rejected status of a team
   */
  static async alterTeamStatus(roomKey, teamId, accepted) {
    try {
      if (typeof accepted !== 'boolean') {
        throw new ShotzException('Invalid format: accepted must be a boolean', 400);
      } else if (accepted) {
        await this._setTeamAccepted(roomKey, teamId);
        return {
          type: 'quizmaster_teamAccepted',
          sessionId: teamId
        };
      } else {
        await this._setTeamRejected(roomKey, teamId);
        return {
          type: 'quizmaster_teamRejected',
          sessionId: teamId
        };
      }
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

  /**
   * PRIVATE - Handles all connections when a quizmaster leaves
   */
  static async _quizmasterLeaveRoom(game, roomKey, quizmasterId) {
    // Send scores to all teams
    const scores = await GameDAO.getScores(roomKey);
    await sendMessageTeams(roomKey, {
      type: 'team_quizmasterLeft',
      scores: scores
    });
    await sendMessageScoreBoards(roomKey, {
      type: 'scoreB_quizmasterLeft',
      scores: scores
    });

    // Close all websocket connecitons
    game.teams.forEach(team => {
      closeConnection(team.sessionId);
      SessionDAO.removeSession(team.sessionId);
    });
    game.scoreboards.forEach(scoreboard => {
      closeConnection(scoreboard);
      SessionDAO.removeSession(scoreboard);
    });

    // Delete game from database
    await GameDAO.deleteGame(roomKey);
    closeConnection(quizmasterId);
    SessionDAO.removeSession(quizmasterId);
  }

  /**
   * PRIVATE - Handles all connections when a team leaves
   */
  static async _teamLeaveRoom(game, roomKey, sessionId) {
    // Send messages to quizmaster and scoreboards
    sendMessageQuizmaster(roomKey, {
      type: 'quizmaster_teamLeft',
      sessionId: sessionId
    });
    sendMessageScoreBoards(roomKey, {
      type: 'scoreB_teamLeft',
      sessionId: sessionId
    });

    // Remove team
    await GameDAO.removeTeam(roomKey, sessionId);
    closeConnection(sessionId);
    SessionDAO.removeSession(sessionId);
  }

  static async _setTeamAccepted(roomKey, teamId) {
    await GameDAO.setTeamAccepted(roomKey, teamId);
    sendMessageTeam(roomKey, teamId, {
      type: 'team_accepted'
    });
    sendMessageScoreBoards(roomKey, {
      type: 'scoreB_team_accepted',
      sessionId: teamId
    });
  }

  static async _setTeamRejected(roomKey, teamId) {
    sendMessageTeam(roomKey, teamId, {
      type: 'team_rejected'
    });
    sendMessageScoreBoards(roomKey, {
      type: 'scoreB_team_rejected',
      sessionId: teamId
    });

    await GameDAO.removeTeam(roomKey, teamId);
    closeConnection(teamId);
    SessionDAO.removeSession(teamId);
  }
}
