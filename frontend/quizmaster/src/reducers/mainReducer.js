import * as Redux from 'redux';
import viewReducer from './viewReducer'
import teamReducer from './teamReducer'

export const mainReducer = Redux.combineReducers({
    views: viewReducer,
    teams: teamReducer
  })