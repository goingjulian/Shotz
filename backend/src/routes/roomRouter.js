import express from 'express';
import GameService from '../service/gameService';
import { sendMessageQuizmaster } from '../service/websocketService'
const router = express.Router();

router.route('/').post((req, res, next) => {
    const quizmasterId = req.session.id;
    GameService.createRoom(quizmasterId)
        .then(roomKey => {
            req.session.roomKey = roomKey;
            res.status(201).json({ roomKey: roomKey });
        })
        .catch(err => {
            next(err.message);
        });
});

router.route('/restore').post((req, res, next) => {
    const roomKey = req.session.roomKey;
    const sessionId = req.session.id;

    GameService.restoreSession(roomKey, sessionId)
        .then(gameState => {
            req.session.roomKey = roomKey;
            res.status(200).json(gameState);
        })
        .catch(err => {
            next(err.message);
        });
});

router.route('/:roomKey/team/:teamId').post( (req, res, next) => {
    const roomKey = req.params.roomKey
    const teamId = req.params.teamId
    const accepted = req.body.accepted

    console.log("Data : ", roomKey, teamId, accepted)

    GameService.alterTeamAcceptedStatus(roomKey, teamId, accepted)
        .then()
        .catch(err => console.log(err))
    res.send("Test")
} )

router.route('/:roomKey').post((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;
    const teamName = req.body.name

    GameService.joinRoom(roomKey, teamName, sessionId)
        .then(message => {
            console.log("keys: ", roomKey, teamName)




            sendMessageQuizmaster(roomKey, {
                type: 'addTeam',
                roomKey: roomKey,
                name: teamName
            })



            req.session.roomKey = roomKey;
            res.status(200).json({ message: message });
        })
        .catch(err => {
            next(err.message);
        });
});



router.use((err, req, res, next) => {
    console.error(err);
    const errMsg = err.message || "Couldn't find url";
    const errCode = err.htmlErrorCode || 404;
    res.status(errCode).json({ error: `${errMsg}` });
});

export default router;
