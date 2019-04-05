import mongoose from 'mongoose';
import { questionSchema } from './question'

export const roundSchema = new mongoose.Schema(
    {
        categories: {type: [String], required: true},
        questions: {type: [questionSchema], required: true},
        activeQuestionIndex: {type: Number, required: true, default: 0}
    },
    { versionKey: false }
);