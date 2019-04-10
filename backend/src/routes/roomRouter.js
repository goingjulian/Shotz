import express from "express";
import roundRouter from "./roundRouter";
import GameService from "../service/gameService";
import QuestionService from "./../service/questionService";

import gameStates from "../definitions/gameStates";
import roles from "../definitions/roles";

import { checkAuthentication, setSession, checkRoleAuthentication } from "./../service/authService";

const roomRouter = express.Router();

/**
 * Routers
 */
roomRouter.use("/:roomKey/round", roundRouter);

/**
 * Create a room
 * ALLOWED: *
 */
roomRouter.route("/").post((req, res, next) => {
  const sessionId = req.session.id;

  GameService.createRoom(sessionId)
    .then(roomKey => {
      setSession(req.session, roomKey, roles.ROLE_QUIZMASTER);
      res.status(201).json({
        roomKey: roomKey,
        gameState: gameStates.REGISTER
      });
    })
    .catch(err => next(err));
});

/**
 * Join a room as a team
 * ALLOWED: *
 */
roomRouter.route("/:roomKey").post((req, res, next) => {
  const sessionId = req.session.id;
  const roomKey = req.params.roomKey;
  const teamName = req.body.teamName;

  GameService.joinRoom(roomKey, teamName, sessionId)
    .then(message => {
      setSession(req.session, roomKey, roles.ROLE_TEAM);
      res.status(200).json(message);
    })
    .catch(err => next(err));
});

/**
 * Leave room
 * ALLOWED: Team, Quizmaster, Scoreboard
 */
roomRouter.route("/:roomKey").delete((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER, roles.ROLE_TEAM, roles.ROLE_SCOREBOARD])
    .then(() => GameService.leaveGame(roomKey, id))
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => next(err));
});

/**
 * Restore a room
 * ALLLOWED: Team, Quizmaster, Scoreboard
 */
roomRouter.route("/restore/:role").get((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roleParam = req.params.role;

  checkRoleAuthentication(role, roleParam)
    .then(() => GameService.restoreSession(roomKey, roleParam, id))
    .then(gameState => {
      res.status(200).json(gameState);
    })
    .catch(err => next(err));
});

/**
 * Get all teams in a room as quizmaster
 * ALLOWED: Quizmaster
 */
roomRouter.route("/:roomKey/teams").get((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => GameService.getTeams(roomKey))
    .then(teams => {
      res.status(200).json(teams);
    })
    .catch(err => next(err));
});

/**
 * delete all not-accepted teams
 * ALLOWED: Quizmaster
 */
roomRouter.route("/:roomKey/teams").delete((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => GameService.removeUnacceptedTeams(roomKey, id))
    .then(teams => {
      res.status(200).json(teams);
    })
    .catch(err => next(err));
});

/**
 * Get scores of all teams in a room
 * ALLOWED: Team, Quizmaster, Scoreboard
 */
roomRouter.route("/:roomKey/teams/scores").get((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER, roles.ROLE_TEAM, roles.ROLE_SCOREBOARD])
    .then(() => GameService.getScores(roomKey))
    .then(scores => {
      res.status(200).json(scores.teams);
    })
    .catch(err => next(err));
});

/**
 * Accept or reject teams
 * ALLOWED: Quizmaster
 */
roomRouter.route("/:roomKey/team/:teamId/status").put((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  const teamId = req.params.teamId;
  const teamStatus = req.body.accepted;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => GameService.alterTeamStatus(roomKey, teamId, teamStatus))
    .then(team => {
      res.status(200).json(team);
    })
    .catch(err => next(err));
});

/**
 * Get a list of categories for a room
 * ALLOWED: *
 */
roomRouter.route("/categories").get((req, res, next) => {
  QuestionService.getAllCategories()
    .then(categories => {
      res.json(categories);
    })
    .catch(err => next(err));
});

export default roomRouter;
