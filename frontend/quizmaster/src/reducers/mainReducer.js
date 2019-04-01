import * as Redux from 'redux';
import viewReducer from './viewReducer'
import teamReducer from './lobbyReducer'
import roundsReducer from './roundsReducer'
import questionsReducer from './questionsReducer'
import roomReducer from './roomReducer'

export const mainReducer = Redux.combineReducers({
    views: viewReducer,
    lobby: teamReducer,
    rounds: roundsReducer,
    questions: questionsReducer,
    room: roomReducer
  })