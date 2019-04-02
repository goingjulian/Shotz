import express from 'express';
import GameService from '../service/gameService';
import WebsocketService from '../service/websocketService'
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

router.route('/:roomKey').post((req, res, next) => {
    const roomKey = req.params.roomKey;
    const sessionId = req.session.id;
    GameService.joinRoom(roomKey, sessionId)
        .then(message => {
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
