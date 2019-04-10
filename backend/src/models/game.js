import mongoose from 'mongoose';
import { teamSchema } from './team';
import { roundSchema } from './round'
import gameStates from '../definitions/gameStates'

const gameSchema = new mongoose.Schema(
    {
        roomKey: { type: String, required: true },
        quizmaster: { type: String, required: true },
        teams: { type: [teamSchema], required: true, default: [] },
        scoreboards: { type: [String], required: true, defaulf: [] },
        gameState: {
            type: String,
            enum: Object.values(gameStates),
            require: true,
            default: 'REGISTER'
        },
        rounds: {type: [roundSchema], required: true, default: []}
    },
    { versionKey: false }
);

export default mongoose.model('Game', gameSchema);
