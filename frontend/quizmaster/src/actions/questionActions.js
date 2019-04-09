import environment from "../environments/environment";

export const questionActionTypes = {
    addCategories: "addCategories",
    ADD_CATEGORY: "ADD_CATEGORY",
    REMOVE_CATEGORY: "REMOVE_CATEGORY"
};

export function setCategoriesAction(categories) {
    return {
        type: questionActionTypes.addCategories,
        categories: categories
    };
}

export function addCategory(category) {
    return {
        type: questionActionTypes.ADD_CATEGORY,
        category: category
    };
}

export function removeCategory(category) {
    return {
        type: questionActionTypes.REMOVE_CATEGORY,
        category: category
    };
}

export function getAllCategories() {
    return dispatch => {
        fetch(`${environment.API_URL}/question/categories`)
            .then(async response => {
                const body = await response.json();
                if (response.ok) dispatch(setCategoriesAction(body));
                else throw new Error(body.error);
            })
            .catch(err => {
                console.log(err.message);
            });
    };
}
