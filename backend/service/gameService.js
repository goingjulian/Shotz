import Game from '../models/Game';
import GameDAO from './../DAO/GameDao';
import ShotzException from './../errors/ShotzException';

const gameDAO = new GameDAO();

export async function createNewRoom(quizmasterId) {
    try {
        const roomCode = await _generateUniqueRoomKey();
        await gameDAO._addNewGame(roomCode, quizmasterId);
        return roomCode;
    }
    catch(err) {
        throw new ShotzException('Error occured when trying to create a new game!');
    }
}

//Todo:: introduce error handling for DB ops
export async function handleRoomJoin(req) {
    if (!req.body.name) throw new Error('Please provide a name');

    const game = await Game.findOne({ roomKey: req.params.roomKey });

    if (!game) throw new Error('RoomKey is invalid');

    if (
        game.quizmaster === req.session.id ||
        game.teams.find(team => team.sessionId === req.session.id)
    ) {
        throw new Error(
            'You have already joined this quiz as a quizmaster or as a team'
        );
    }

    game.teams.push({
        name: req.body.name,
        sessionId: req.session.id,
        accept: false
    })

    await game.save();

    return req.params.roomKey;
}

async function _addNewGameToDB(roomKey, quizmasterSessionId) {
    const game = new Game({
        roomKey: roomKey,
        quizmaster: quizmasterSessionId,
        teams: []
    });
    console.log('saving game');

    await game.save();
    console.log('saved game');
}

async function _generateUniqueRoomKey() {
    let roomKey = null;
    let isUnique = false;

    while (!isUnique) {
        roomKey = Math.floor(1000 + Math.random() * 9000);

        let keyExists;
        try {
            keyExists = await Game.findOne({ roomKey: roomKey });
        } catch (err) {
            console.log('ERROR', err);
        }

        if (!keyExists) {
            isUnique = true;
        }
    }
    return roomKey;
}
