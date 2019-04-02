import mongoose from 'mongoose';

export const teamSchema = new mongoose.Schema({
    name: {type: String, required: true},
    sessionId: {type: String, required: true},
    accepted: { type: Boolean, required: true }
})