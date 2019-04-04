import express from "express";
import GameService from "../service/gameService";
import { sendMessageQuizmaster, sendMessageTeam } from "../service/websocketService";
import ShotzException from "./../exceptions/ShotzException";
import { closeConnection } from "./../service/websocketService";
const router = express.Router();

router.route("/").post((req, res, next) => {
    const quizmasterId = req.session.id;
    GameService.createRoom(quizmasterId)
        .then(roomKey => {
            req.session.roomKey = roomKey;
            res.status(201).json({ roomKey: roomKey });
        })
        .catch(err => {
            next(err);
        });
});

router.route("/restore").post((req, res, next) => {
    const roomKey = req.session.roomKey;
    const sessionId = req.session.id;
    const loginRole = req.body.role;

    GameService.restoreSession(roomKey, loginRole, sessionId)
        .then(gameState => {
            console.log(`Session for ${loginRole}: ${sessionId} restored in room ${roomKey}`);
            req.session.roomKey = roomKey;
            res.status(200).json(gameState);
        })
        .catch(err => {
            next(err);
        });
});

router.route("/:roomKey/team/:teamSessionId").put((req, res, next) => {
    const roomKey = req.params.roomKey;
    const teamSessionId = req.params.teamSessionId;
    const accepted = req.body.accepted;
    if (typeof accepted !== "boolean") {
        next(new ShotzException("Accepted required in body!", 400));
    } else {
        GameService.alterTeamStatus(roomKey, teamSessionId, accepted)
            .then(teamStatus => {
                res.status(200).json(teamStatus);
            })
            .catch(err => {
                next(err);
            });
    }
});

router.route("/:roomKey/leave").delete((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;

    GameService.leaveGame(roomKey, sessionId)
        .then(teams => {
            res.json(teams);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

//delete all not-accepted teams
router.route("/:roomKey/teams").delete((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;

    GameService.removeUnacceptedTeams(roomKey, sessionId)
        .then(teams => {
            res.json(teams);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.route("/:roomKey").post((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;
    const teamName = req.body.teamName;

    GameService.joinRoom(roomKey, teamName, sessionId)
        .then(message => {
            sendMessageQuizmaster(roomKey, {
                type: "quizmaster_newTeam"
            });
            req.session.roomKey = roomKey;
            res.status(200).json(message);
        })
        .catch(err => {
            next(err);
        });
});

router.route("/:roomKey/teams").get((req, res, next) => {
    const roomKey = req.params.roomKey;
    GameService.getTeams(roomKey)
        .then(teams => {
            res.status(200).json(teams);
        })
        .catch(err => next(err));
});

router.use((err, req, res, next) => {
    const errMsg = err.message || "Couldn't find url";
    const errCode = err.htmlErrorCode || 404;
    res.status(errCode).json({ error: `${errMsg}` });
});

export default router;
