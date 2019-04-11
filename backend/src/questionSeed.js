import fs from 'fs';
import Question from './models/question';

export default async function addQuestionsToDB() {
    const path = './src/questionsDemo.json';

    try {
        await Question.deleteMany();

        const file = await readFileP(path);

        const questions = JSON.parse(file);

        await Question.insertMany(questions);
    } catch(err) {
        throw new Error(`Error while adding initial questions to the database, file in path ${path} not found`);
    }
}

async function readFileP(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};