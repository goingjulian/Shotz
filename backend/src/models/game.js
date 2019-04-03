import mongoose from 'mongoose';
import { teamSchema } from './team';

const gameSchema = new mongoose.Schema(
    {
        roomKey: { type: String, required: true },
        quizmaster: { type: String, required: true },
        teams: { type: [teamSchema], required: true, default: [] },
        gameState: {
            type: String,
            enum: ['REGISTER'],
            require: true,
            default: 'REGISTER'
        }
    },
    { versionKey: false }
);

export default mongoose.model('Game', gameSchema);