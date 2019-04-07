import mongoose from 'mongoose';

export const answerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    answer: { type: String, required: true },
    correct: { type: Boolean, required: true, default: false }
})