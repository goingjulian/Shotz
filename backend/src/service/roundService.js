import GameDAO from '../DAO/GameDao';
import QuestionDao from '../DAO/QuestionDao';

import ShotzException from '../exceptions/ShotzException';
import gameStates from '../definitions/gameStates';

import {
  sendMessageQuizmaster,
  sendMessageTeams,
  sendMessageScoreBoards
} from './websocketService';

export default class RoundService {
  static async startNewRound(roomKey, categories) {
    try {
      if (!Array.isArray(categories)) {
        throw new ShotzException(
          'Invalid format: the chosen categories have to be in an array!',
          400
        );
      } else if (categories.length < 1 || categories.length > 3) {
        throw new ShotzException(
          'Invalid length: you need at least 1 and max 3 categories to start a round!',
          400
        );
      } else {
        const allQuestions = await QuestionDao.getAllQuestionsByCategories(categories);
        const chosenQuestions = this._pickRandomquestionsFromList(allQuestions, 12);
        await GameDAO.addRound(roomKey, chosenQuestions, categories);
        await GameDAO.alterGameState(roomKey, gameStates.IN_ROUND);
        const rounds = await GameDAO.getRounds(roomKey).lean();
        const currentRound = rounds.rounds[rounds.rounds.length - 1];

        sendMessageTeams(roomKey, {
          type: 'team_nextQuestion'
        });

        sendMessageScoreBoards(roomKey, {
          type: 'scoreB_nextQuestion',
          currentQuestionIndex: currentRound.activeQuestionIndex,
          currentQuestion: currentRound.questions[currentRound.activeQuestionIndex]
        });

        return {
          gameState: gameStates.IN_ROUND,
          rounds: rounds.rounds,
          currentQuestionIndex:
            rounds.rounds.length > 0
              ? rounds.rounds[rounds.rounds.length - 1].activeQuestionIndex
              : 0 //This doesn't go well when you start a new round > heeft te maken dat 0 false is
        };
      }
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  static async setStateselectCategory(roomKey) {
    try {
      await GameDAO.alterGameState(roomKey, gameStates.CATEGORY_SELECT);
      sendMessageTeams(roomKey, {
        type: 'team_selectingCategories'
      });
      sendMessageScoreBoards(roomKey, {
        type: 'scoreB_selectingCategories'
      });
      return {
        gameState: gameStates.CATEGORY_SELECT
      };
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  static async endRound(roomKey) {
    try {
      await GameDAO.alterGameState(roomKey, gameStates.END_ROUND);
      sendMessageTeams(roomKey, {
        type: 'team_endRound'
      });
      sendMessageScoreBoards(roomKey, {
        type: 'scoreB_endRound'
      });
      return await GameDAO.getScores(roomKey);
    } catch (err) {
      if (!err.htmlErrorCode) throw new ShotzException(err.message, 500);
      else throw err;
    }
  }

  /**
   * PRIVATE - Make a list of 12 random questions of the categories
   */
  static _pickRandomquestionsFromList(questions, amount) {
    const chosenQuestions = [];
    const questionAmount = questions.length > amount ? amount : questions.length;

    for (let i = 0; i < questionAmount; i++) {
      const randomNumber = Math.floor(Math.random() * questions.length);
      const questionAlreadyPicked = chosenQuestions.find(
        question => question._id === questions[randomNumber]._id
      );

      if (!questionAlreadyPicked) {
        chosenQuestions.push({
          question: questions[randomNumber].question,
          answer: questions[randomNumber].answer,
          category: questions[randomNumber].category
        });
      } else {
        i--;
      }
    }
    return chosenQuestions;
  }
}
