import express from "express";
import questionRouter from "./questionRouter";
import GameService from "../service/gameService";

import { checkAuthentication } from "./../service/authService";
import roles from "../definitions/roles";

const roundRouter = express.Router({ mergeParams: true });

/**
 * Routers
 */
roundRouter.use("/question", questionRouter);

/**
 * Start new round
 * ALLOWED: Quizmaster
 */
roundRouter.route("/start").post((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  const categories = req.body.categories;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => GameService.startNewRound(roomKey, id, categories))
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => next(err));
});

/**
 * Sets the state to selecting categories
 * ALLOWED: Quizmaster
 */
roundRouter.route("/select-category").put((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => GameService.selectCategory(roomKey, id))
    .then(gameState => {
      res.status(200).json({ gameState: gameState });
    })
    .catch(err => next(err));
});

/**
 * Close the current round
 * ALLOWED: Quizmaster
 */
roundRouter.route("/end").put((req, res, next) => {
  const { roomKey, role, id } = req.session;
  const roomKeyParam = req.params.roomKey;

  checkAuthentication(roomKey, role, roomKeyParam, [roles.ROLE_QUIZMASTER])
    .then(() => GameService.endRound(roomKey, id))
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => next(err));
});

export default roundRouter;
