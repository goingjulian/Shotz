import { questionActionTypes } from "../actions/questionActions";

const initalQuestionState = {
    categories: [],
    selectedCategories: []
};

export default function questionReducer(state = initalQuestionState, action) {
    let selectedCategories;
    switch (action.type) {
        case questionActionTypes.addCategories:
            return { ...state, categories: action.categories };
        case questionActionTypes.ADD_CATEGORY:
            selectedCategories = state.selectedCategories.slice();
            selectedCategories.push(action.category);
            return {
                ...state,
                selectedCategories: selectedCategories.slice()
            };
        case questionActionTypes.REMOVE_CATEGORY:
            selectedCategories = state.selectedCategories.slice();
            selectedCategories = selectedCategories.filter(it => it !== action.category);
            return {
                ...state,
                selectedCategories: selectedCategories.slice()
            };
        default:
            return state;
    }
}
