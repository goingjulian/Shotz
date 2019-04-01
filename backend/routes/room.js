import express from 'express';
const router = express.Router()

import { handleRoomCreation, handleRoomJoin } from '../service/gameService'

router.post("/", async (req, res, next) => {
    try {
        const roomKey = await handleRoomCreation(req)

        req.session.roomKey = roomKey

        res.json({
            roomKey: roomKey
        })
    } catch (err) {
        console.error(err)
        next(err.message)
    }

})

router.post("/:roomKey", async (req, res, next) => {
    try {
       const roomKey = await handleRoomJoin(req)

        res.json({
            roomKey: roomKey
        })
    } catch (err) {
        console.error(err)
        next(err.message)
    }
})

export default router