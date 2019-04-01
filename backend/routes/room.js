import express from 'express';
const router = express.Router();

import { createNewRoom, handleRoomJoin } from '../service/gameService';

router.post('/', async (req, res, next) => {
    try {
        const quizmasterId = req.session.id;
        const roomKey = await createNewRoom(quizmasterId);
        req.session.roomKey = roomKey;
        res.send(201).json({ roomKey: roomKey });
    } catch (err) {
        console.error(err);
        next(err.message);
    }
});

router.post('/:roomKey', async (req, res, next) => {
    try {
        const roomKey = await handleRoomJoin(req);

        res.json({ roomKey: roomKey });
    } catch (err) {
        console.error(err);
        next(err.message);
    }
});

router.use((err, req, res, next) => {
    const errMsg = err.message || 'Internal server error';
    const errCode = err.htmlErrorCode || 500;
    res.status(errCode).json({ error: `${errMsg}` });
});

export default router;
