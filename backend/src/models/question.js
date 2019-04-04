import mongoose from 'mongoose';

export const questionSchema = new mongoose.Schema(
    {
        question: {type: String, required: true},
        answer: {type: String, required: true},
        category: {type: String, required: true}
    },
    { versionKey: false }
);

export default mongoose.model('Question', questionSchema);
