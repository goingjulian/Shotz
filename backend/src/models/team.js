import mongoose from 'mongoose';
import { answerSchema } from './answer'

export const teamSchema = new mongoose.Schema({
    teamName: {type: String, required: true},
    sessionId: {type: String, required: true},
    accepted: { type: Boolean, required: true },
    answers: { type: [answerSchema], reguired: true },
    score: {type: Number, required: true}
})