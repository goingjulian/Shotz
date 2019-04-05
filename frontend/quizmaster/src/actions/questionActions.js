import environment from '../environments/environment'

export const questionActionTypes = {
    addCategories: "addCategories"
}

export function addCategoriesAction(categories) {
    return {
        type: questionActionTypes.addCategories,
        categories: categories
    }
}

export function getAllCategories() {
    return async dispatch => {
        const response = await fetch(`${environment.API_URL}/question/categories`);

        if(!response.ok) throw new Error('Error while fetching categories')

        const body = await response.json()

        dispatch(addCategoriesAction(body))
    }
}
