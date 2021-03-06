import environment from '../environments/environment';
import { addErrorAction } from './roomActions';

export const questionActionTypes = {
  SET_CATEGORY: 'SET_CATEGORY',
  ADD_CATEGORY: 'ADD_CATEGORY',
  REMOVE_CATEGORY: 'REMOVE_CATEGORY',
  EMPTY_SELECTED_CATEGORIES: 'EMPTY_SELECTED_CATEGORIES'
};

export function setCategoriesAction(categories) {
  return {
    type: questionActionTypes.SET_CATEGORY,
    categories: categories
  };
}

export function emptySelectedCategoriesAction() {
  return {
    type: questionActionTypes.EMPTY_SELECTED_CATEGORIES
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
    const options = {
      method: 'GET',
      credentials: 'include'
    };

    fetch(`${environment.API_URL}/room/categories`, options)
      .then(async response => {
        const body = await response.json();
        if (response.ok) dispatch(setCategoriesAction(body));
        else throw new Error(body.error);
      })
      .catch(err => dispatch(addErrorAction(err.message)));
  };
}
