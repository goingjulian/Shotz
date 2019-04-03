import * as Redux from 'redux';
import viewReducer from './viewReducer'
import roundsReducer from './roundsReducer'
import questionsReducer from './questionsReducer'
import roomReducer from './roomReducer'
import teamReducer from './teamReducer';

export const mainReducer = Redux.combineReducers({
    views: viewReducer,
    teams: teamReducer,
    rounds: roundsReducer,
    questions: questionsReducer,
    room: roomReducer
  })