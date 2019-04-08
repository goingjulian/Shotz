import environment from '../environments/environment';

export const questionActionTypes = {
  addCategories: 'addCategories'
};

export function addCategoriesAction(categories) {
  return {
    type: questionActionTypes.addCategories,
    categories: categories
  };
}

export function getAllCategories() {
  return dispatch => {
    fetch(`${environment.API_URL}/question/categories`)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(addCategoriesAction(body));
        else throw new Error(body.error);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
}
