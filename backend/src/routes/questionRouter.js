import express from "express";

import QuestionService from '../service/questionService';

import { checkAuthentication } from "./../service/authService";
import roles from "../definitions/roles";

const questionRouter = express.Router({ mergeParams: true });

/**
 * Get current question
 * ALLOWED: Quizmaster, Team, Scoreboard
 */
questionRouter.route("/").get((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER, roles.ROLE_TEAM, roles.ROLE_SCOREBOARD])
    .then(() => QuestionService.getCurrentQuestion(roomKey))
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => next(err));
});

/**
 * Submit answer for a question
 * ALLOWED: Team
 */
questionRouter.route("/:questionId/answer").post((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  const questionId = req.params.questionId;
  const answer = req.body.answer;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_TEAM])
    .then(() => QuestionService.submitAnswer(roomKey, id, questionId, answer))
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => next(err));
});

/**
 * Accept or reject a answer
 * ALLOWED: Quizmaster
 */
questionRouter.route("/:questionId/answer/:teamId").put((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  const questionId = req.params.questionId;
  const teamId = req.params.teamId;
  const correct = req.body.correct;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => QuestionService.setCorrectStatusStatusAnswer(roomKey, teamId, questionId, correct))
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => next(err));
});

/**
 * Show the answer of the current question on all scoreboards
 * ALLOWED: Quizmaster
 */
questionRouter.route("/reveal").put((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => QuestionService.revealAnswer(roomKey, id))
    .then(() => {
      res.status(200).send();
    })
    .catch(err => next(err));
})

/**
 * Proceed to next question in round
 * ALLOWED: Quizmaster
 */
questionRouter.route("/next").put((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => QuestionService.goTonextQuestionInRound(roomKey))
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => next(err));
});

/**
 * Delete question
 * ALLOWED: Quizmaster
 */
questionRouter.route("/:questionId").delete((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  const questionId = req.params.questionId;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => QuestionService.deleteQuestionFromCurrentRound(roomKey, id, questionId))
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => console.log(err));
});

export default questionRouter;
