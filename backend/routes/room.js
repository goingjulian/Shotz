import express from 'express';
import Game from '../models/game';

const router = express.Router()

router.post("/", async (req, res, next) => {
    try {
        if (!req.session.roomKey) {
            let isUnique = false

            while (!isUnique) {
                let roomKey = Math.floor(1000 + Math.random() * 9000)

                let keyExists = await Game.findOne({ roomKey: req.session.roomKey })

                if (!keyExists) {
                    req.session.roomKey = roomKey;
                    isUnique = true;
                }
            }

            await addGameToDB(req.session.roomKey, req.session.id)
        }

        res.json({
            roomKey: req.session.roomKey
        })
    } catch (err) {
        console.error(err.message)
        next(err.message)
    }

})

router.post("/:roomKey", async (req, res, next) => {
    try {
        if (!req.body.name) {
            throw new Error("Please provide a name")
        }

        const game = await Game.findOne({ roomKey: req.params.roomKey })

        if (!game) {
            throw new Error("RoomKey is invalid")
        }

        if(game.quizmaster === req.session.id || game.teams.find(team => team.sessionId === req.session.id)) {
            throw new Error("You have already joined this quiz as a quizmaster or as a team")
        }

        game.teams.push({
            name: req.body.name,
            sessionId: req.session.id
        })

        await game.save()

        res.json({
            roomKey: req.params.roomKey
        })
    } catch (err) {
        console.error(err.message)
        next(err.message)
    }
})

async function addGameToDB(roomKey, quizmasterSessionId) {

    const game = new Game({
        roomKey: roomKey,
        quizmaster: quizmasterSessionId,
        teams: []

    })
    console.log("saving game")

    await game.save()
    console.log("saved game")

}

export default router