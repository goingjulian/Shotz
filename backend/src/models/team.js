import mongoose from 'mongoose';

export const teamSchema = new mongoose.Schema({
    teamName: {type: String, required: true},
    sessionId: {type: String, required: true},
    accepted: { type: Boolean, required: true },
    score: {type: Number, required: true}
})