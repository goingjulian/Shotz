import express from 'express';
const router = express.Router();

import { createNewRoom, handleRoomJoin } from '../service/gameService';

router.route('/').post((req, res, next) => {
    const quizmasterId = req.session.id;
    createNewRoom(quizmasterId)
        .then(roomCode => {
            req.session.roomCode = roomCode;
            res.send(201).json({ roomCode: roomCode });
        })
        .catch(err => {
            next(err.message);
        });
});

router.post('/:roomCode', async (req, res, next) => {
    try {
        const roomCode = await handleRoomJoin(req);
        res.json({ roomCode: roomCode });
    } catch (err) {
        next(err.message);
    }
});

router.use((err, req, res, next) => {
    console.error(err);
    const errMsg = err.message || "Couldn't find url";
    const errCode = err.htmlErrorCode || 404;
    res.status(errCode).json({ error: `${errMsg}` });
});

export default router;
