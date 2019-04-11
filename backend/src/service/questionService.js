import GameDAO from '../DAO/GameDao';
import QuestionDAO from '../DAO/QuestionDao';

import ShotzException from '../exceptions/ShotzException';
import gameStates from '../definitions/gameStates';

import {
  sendMessageTeam,
  sendMessageQuizmaster,
  sendMessageTeams,
  sendMessageScoreBoards
} from './websocketService';

export default class QuestionService {
  static async getAllCategories() {
    try {
      const categories = await QuestionDAO.getAllCategories();
      if (!categories || categories.length < 1) throw new Error(`No categories found`);
      return categories;
    } catch (err) {
      throw new ShotzException(`Error while getting all categories: ${err.message}`, 500);
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
        };
      }
      const currentRound = result[0].round[0];
      const currentQuestion = currentRound.questions[currentRound.activeQuestionIndex];
      return {
        questionId: currentQuestion._id,
        question: currentQuestion.question,
        category: currentQuestion.category
      };
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  static async submitAnswer(roomKey, teamId, questionId, answer) {
    try {
      const game = await GameDAO.getGame(roomKey);
      if (typeof answer !== 'string') {
        throw new ShotzException('Answer must be a string', 400);
      } else if (game.gameState === gameStates.SUBMIT_CLOSED) {
        throw new ShotzException(
          `Can't submit answer for question because the question is closed!`,
          400
        );
      } else {
        await GameDAO.submitAnswer(roomKey, teamId, questionId, answer);
        sendMessageQuizmaster(roomKey, {
          type: 'quizmaster_answerSubmitted',
          teamSessionId: teamId,
          questionId: questionId,
          answer: answer
        });
        return {
          success: 'Answer submitted'
        };
      }
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  static async setCorrectStatusStatusAnswer(roomKey, teamSessionId, questionId, correct) {
    try {
      if (typeof questionId !== 'string') {
        throw new ShotzException('questionId must be a string', 400);
      } else if (typeof correct !== 'boolean') {
        throw new ShotzException('correct must be a boolean', 400);
      } else {
        const teams = await GameDAO.setCorrectStatusStatusAnswer(
          roomKey,
          teamSessionId,
          questionId,
          correct
        );
        const responseType = correct ? 'team_answerCorrect' : 'team_answerIncorrect';

        sendMessageScoreBoards(roomKey, {
          type: 'scoreB_answerQuestion',
          correct: correct,
          teamId: teamSessionId,
          questionId: questionId
        });

        sendMessageTeam(roomKey, teamSessionId, {
          type: responseType,
          questionId: questionId
        });

        return teams;
      }
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  static async revealAnswer(roomKey, sessionId) {
    await GameDAO.alterGameState(roomKey, gameStates.SUBMIT_CLOSED);
    await sendMessageScoreBoards(roomKey, {
      type: 'scoreB_revealAnswer'
    });
    await sendMessageTeams(roomKey, {
      type: 'team_submitClosed'
    });
  }

  static async goTonextQuestionInRound(roomKey) {
    try {
      const rounds = await GameDAO.getRounds(roomKey).lean();

      if (!rounds)
        throw new ShotzException(
          `Error while proceeding to next question, roomKey invalid or not authorized`,
          400
        );

      const currentRound = rounds.rounds[rounds.rounds.length - 1];

      if (currentRound.questions.length <= currentRound.activeQuestionIndex + 1)
        throw new ShotzException('Last question reached', 400);

      await GameDAO.goTonextQuestionInRound(roomKey, currentRound._id);
      sendMessageTeams(roomKey, {
        type: 'team_nextQuestion'
      });
      sendMessageScoreBoards(roomKey, {
        type: 'scoreB_nextQuestion',
        currentQuestionIndex: currentRound.activeQuestionIndex + 1,
        currentQuestion: currentRound.questions[currentRound.activeQuestionIndex + 1]
      });

      return { activeQuestionIndex: currentRound.activeQuestionIndex + 1 };
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  static async deleteQuestionFromCurrentRound(roomKey, questionId) {
    try {
      const questions = await GameDAO.deleteQuestionFromCurrentRound(roomKey, questionId);
      return questions;
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }
}
