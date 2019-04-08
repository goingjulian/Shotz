import express from "express";
import GameService from "../service/gameService";
import { sendMessageQuizmaster, sendMessageTeam, sendMessageTeams } from "../service/websocketService";
import ShotzException from "./../exceptions/ShotzException";
import { closeConnection } from "./../service/websocketService";
import gameStates from '../definitions/gameStates'
const router = express.Router();

/**
 * Create a room as a quizmaster
 */
router.route("/").post((req, res, next) => {
    const quizmasterId = req.session.id;
    GameService.createRoom(quizmasterId)
        .then(roomKey => {
            req.session.roomKey = roomKey;
            res.status(201).json({
                roomKey: roomKey,
                gameState: gameStates.REGISTER
            });
        })
        .catch(err => {
            next(err);
        });
});

/**
 * Restore a session
 */
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

/**
 * Accept or reject teams
 */
router.route("/:roomKey/team/:teamSessionId").put((req, res, next) => {
    console.log('acceptReject teamId: ', req.params.teamSessionId)
    const roomKey = req.params.roomKey;
    const teamSessionId = req.params.teamSessionId;
    const accepted = req.body.accepted;
    GameService.alterTeamStatus(roomKey, teamSessionId, accepted)
        .then(teamStatus => {
            res.status(200).json(teamStatus);
        })
        .catch(err => {
            next(err);
        });
});

router.route("/:roomKey/leave").delete((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;

    GameService.leaveGame(roomKey, sessionId)
        .then(teams => {
            res.json(teams);
        })
        .catch(err => {
            next(err);
        });
});

/**
 * delete all not-accepted teams
 */
router.route("/:roomKey/teams").delete((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;

    GameService.removeUnacceptedTeams(roomKey, sessionId)
        .then(teams => {
            res.json(teams);
        })
        .catch(err => {
            next(err);
        });
});

/**
 * Join a room as a team
 */
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

/**
 * Get all teams in a room as quizmaster
 */
router.route("/:roomKey/teams").get((req, res, next) => {
    const roomKey = req.params.roomKey;
    GameService.getTeams(roomKey)
        .then(teams => {
            res.status(200).json(teams);
        })
        .catch(err => next(err));
});

/**
 * start new round
 */
router.route("/:roomKey/round").post((req, res, next) => {
    const roomKey = req.params.roomKey;
    const categories = req.body.categories;
    const sessionId = req.session.id;
    console.log(roomKey, sessionId, categories)
    GameService.startNewRound(roomKey, sessionId, categories)
        .then(response => {
            res.json(response);
            sendMessageTeams(roomKey, {
                type: "team_nextQuestion"
            });
        })
        .catch(err => {
            console.log(err);
            next(err)
        })
});

router.route("/:roomKey/round/end").put((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;
    GameService.endRound(roomKey, sessionId)
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            next(err)
        })
});

router.route("/:roomKey/score").get((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;
    res.status(200).json({})
    // GameService.getTeamScore(roomKey, sessionId)
    //     .then(response => {
    //         res.status(200).json(response);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         next(err)
    //     })
});



/**
 * next question in round
 */
router.route('/:roomKey/round/question/next').put((req, res, next) => {
    const sessionId = req.session.id;
    const roomKey = req.params.roomKey;

    GameService.goTonextQuestionInRound(roomKey, sessionId)
        .then(response => {
            res.json(response);
            sendMessageTeams(roomKey, {
                type: "team_nextQuestion"
            });
        })
        .catch(err => {
            throw err;
            next(err);
        })
});

/**
 * get current question
 */
router.route('/:roomKey/round/question').get((req, res, next) => {
    const roomKey = req.params.roomKey;

    GameService.getCurrentQuestion(roomKey)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            next(err);
        })
})

router.route('/:roomKey/round/question/answer').post((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;
    const questionId = req.body.questionId;
    const answer = req.body.answer;

    GameService.submitAnswer(roomKey, sessionId, questionId, answer)
        .then(response => {
            res.json(response);

            sendMessageQuizmaster(roomKey, {
                type: "quizmaster_answerSubmitted",
                teamSessionId: sessionId,
                questionId: questionId,
                answer: answer,
                correct: null
            })
        })
        .catch(err => {
            next(err);
        })
})

router.route('/:roomKey/round/questions/answer/:questionId').put((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;
    const teamSessionId = req.body.teamSessionId;
    const questionId = req.params.questionId;
    const correct = req.body.correct;

    GameService.setCorrectStatusStatusAnswer(roomKey, sessionId, teamSessionId, questionId, correct)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            console.log(err);
            next(err);
        })
})

export default router;
