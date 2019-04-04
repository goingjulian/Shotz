import {questionActionTypes} from '../actions/questionActions'

const initalQuestionState = {
    allCategories: [],
    allQuestions: []
}

export default function questionReducer(state = initalQuestionState, action) {
    switch(action.type) {
        case questionActionTypes.addCategories:
            return {...state, allCategories: action.categories}
        default:
            return state;
    }
}