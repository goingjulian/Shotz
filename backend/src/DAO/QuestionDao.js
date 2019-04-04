import Question from '../models/question'

export default class QuestionDAO {
    static getAllCategories() {
        return Question.find({}).distinct('category')
    }

    static getAllQuestionsByCategories(categories) {
        return Question.find({
            category: {
                $in: categories
            }
        })
    }
}