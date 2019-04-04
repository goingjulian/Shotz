import ShotzException from "../exceptions/ShotzException";
import QuestionDAO from '../DAO/QuestionDao'

export default class QuestionService {
    static async getAllCategories() {
        try {
            const categories = await QuestionDAO.getAllCategories();

            if(!categories || categories.length < 1) throw new Error(`No categories found`)

            return categories;
        } catch (err) {
            throw new ShotzException(`Error while getting all categories: ${err.message}`, 500)
        }
    }
}