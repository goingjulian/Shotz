import Game from '../models/Game';
import GameDAO from '../DAO/GameDao';
import ShotzException from '../exceptions/ShotzException';

const gameDAO = new GameDAO();

// Todo make gameserver class
// Compact functions

export async function createNewRoom(quizmasterId) {
    try {
        const roomCode = await _generateUniqueRoomCode();
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

    const game = await Game.findOne({ roomCode: req.params.roomCode });

    if (!game) throw new Error('Room code is invalid');

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

    return req.params.roomCode;
}

async function _addNewGameToDB(roomCode, quizmasterSessionId) {
    const game = new Game({
        roomCode: roomCode,
        quizmaster: quizmasterSessionId,
        teams: []
    });
    console.log('saving game');

    await game.save();
    console.log('saved game');
}

async function _generateUniqueRoomCode() {
    let roomCode = null;
    let isUnique = false;

    while (!isUnique) {
        roomCode = Math.floor(1000 + Math.random() * 9000);

        let keyExists;
        try {
            keyExists = await Game.findOne({ roomCode: roomCode });
        } catch (err) {
            console.log('ERROR', err);
        }

        if (!keyExists) {
            isUnique = true;
        }
    }
    return roomCode;
}
