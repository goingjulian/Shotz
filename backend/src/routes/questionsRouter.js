import express from "express";
import QuestionService from '../service/questionService'
const router = express.Router();

router.route('/categories').get((req, res, next) => {
    QuestionService.getAllCategories()
        .then(categories => {
            res.json(categories)
        })
        .catch(err => {
            next(err)
        })
})

export default router