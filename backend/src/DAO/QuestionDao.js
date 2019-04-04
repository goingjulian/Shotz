import Question from '../models/question'

export default class QuestionDAO {
    static getAllCategories() {
        return Question.find({}).distinct('category')
        .catch(err => {
            throw new Error(`Error: ${err}`);
        })
    }

    static getAllQuestionsByCategories(categories) {
        return Question.find({
            category: {
                $in: categories
            }
        })
        .catch(err => {
            console.log(err)
            throw new Error(`Error: ${err}`);
        })
    }
}