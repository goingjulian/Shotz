import Game from '../models/game';
import gameStates from '../definitions/gameStates';
import ShotzException from '../exceptions/ShotzException';

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
        { teams: { $elemMatch: { sessionId: sessionId } } },
        { scoreboards: sessionId }
      ]
    });
  }

  static getGame(roomKey) {
    return Game.findOne({ roomKey: roomKey });
  }

  static deleteGame(roomKey) {
    return Game.deleteOne({ roomKey: roomKey });
  }

  static getTeam(roomKey, teamSessionId) {
    return Game.findOne({ roomKey: roomKey, 'teams.sessionId': teamSessionId }, 'teams.$');
  }

  static async getQuizmaster(roomKey) {
    const quizmaster = await Game.findOne({ roomKey: roomKey }, { quizmaster: 1, _id: 0 });
    return quizmaster.quizmaster;
  }

  static getTeams(roomKey) { 
    return Game.findOne({ roomKey: roomKey }, { _id: 0, 'teams._id': 0 });
  }

  static getScoreBoards(roomKey) {
    return Game.findOne({ roomKey: roomKey }, { scoreboards: 1, _id: 0 });
  }

  static getScores(roomKey) {
    return Game.findOne({ roomKey: roomKey }, { teams: 1, 'teams.score': 1, 'teams.teamName': 1 });
  }

  static setTeamAccepted(roomKey, teamSessionId) {
    return Game.updateOne(
      { roomKey: roomKey, 'teams.sessionId': teamSessionId, gameState: gameStates.REGISTER },
      {
        $set: {
          'teams.$.accepted': true
        }
      }
    );
  }

  static removeScoreboard(roomKey, sessionId) {
    return Game.updateOne(
      {
        roomKey: roomKey
      },
      {
        $pull: {
          scoreboards: { sessionId }
        }
      }
    );
  }

  static removeTeam(roomKey, teamSessionId) {
    return Game.updateOne(
      {
        roomKey: roomKey
      },
      {
        $pull: {
          teams: { sessionId: teamSessionId }
        }
      }
    );
  }

  static removeUnacceptedTeams(roomKey, sessionId) {
    return Game.updateOne(
      { roomKey: roomKey },
      {
        $pull: {
          teams: { accepted: false }
        }
      }
    );
  }

  static alterGameState(roomKey, newState) {
    return Game.updateOne({ roomKey: roomKey }, { gameState: newState });
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

  static joinGameAsScoreBoard(roomKey, sessionId) {
    return Game.updateOne(
      { roomKey: roomKey },
      {
        $push: {
          scoreboards: sessionId
        }
      }
    );
  }

  static addRound(roomKey, randomQuestions, categories) {
    return Game.updateOne(
      { roomKey: roomKey },
      {
        $push: {
          rounds: {
            categories: categories,
            questions: randomQuestions
          }
        }
      }
    );
  }

  static getRounds(roomKey, sessionId) {
    return Game.findOne({ roomKey: roomKey }, { rounds: 1, _id: 0 });
  }

  static goTonextQuestionInRound(roomKey, currentRoundMongoId) {
    return Game.updateOne(
      {
        roomKey: roomKey,
        rounds: { $elemMatch: { _id: currentRoundMongoId } }
      },
      {
        $inc: {
          'rounds.$.activeQuestionIndex': 1
        }
      }
    );
  }

  static getCurrentQuestion(roomKey) {
    return Game.aggregate([
      { $match: { roomKey: roomKey } },
      { $project: { _id: 0, round: { $slice: ['$rounds', -1] } } }
    ]);
  }
  static submitAnswer(roomKey, sessionId, questionId, answer) {
    return Game.updateOne(
      {
        roomKey: roomKey,
        teams: { $elemMatch: { 'answers.questionId': { $ne: questionId }, sessionId: sessionId } },
        gameState: { $ne: gameStates.SUBMIT_CLOSED }
      },
      {
        $push: {
          'teams.$.answers': {
            questionId: questionId,
            answer: answer
          }
        }
      }
    );
  }

  static setCorrectStatusStatusAnswer(roomKey, teamSessionId, questionId, correct) {
    return Game.findOne({
      roomKey: roomKey,
      teams: { $elemMatch: { 'answers.questionId': questionId } }
    }).then(result => {
      const team = result.teams.findIndex(team => team.sessionId === teamSessionId);
      if (team === undefined)
        throw new ShotzException('Team not found with provided sessionId', 401);

      const answer = result.teams[team].answers.findIndex(
        answer => answer.questionId === questionId
      );
      if (result.teams[team].answers[answer].correct !== null)
        throw new ShotzException('You have already graded this answer', 400);

      result.teams[team].answers[answer].correct = correct;

      if (correct) result.teams[team].score += 10;

      result.save();
      return result.teams.toObject();
    });
  }

  static deleteQuestionFromCurrentRound(roomKey, questionId) {
    return Game.findOne({ roomKey: roomKey }).then(result => {
      if (result === undefined) throw new ShotzException('Game not found', 400);

      const curRound = result.rounds.length - 1;

      if (curRound === undefined) throw new ShotzException('No round active', 400);

      const questionIndex = result.rounds[curRound].questions.findIndex(
        question => question._id.toString() === questionId
      );

      if (questionIndex === undefined) throw new ShotzException('Question not found', 400);

      if (result.rounds[curRound].activeQuestionIndex >= questionIndex)
        throw new ShotzException('QuestionId must be higher than the current question index', 400);

      result.rounds[curRound].questions.splice(questionIndex, 1);
      result.save();

      return result.rounds[curRound].questions.toObject();
    });
  }
}
