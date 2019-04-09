import * as Redux from 'redux';
import viewReducer from './viewReducer'
import roundsReducer from './roundsReducer'
import questionReducer from './questionReducer'
import roomReducer from './roomReducer'
import teamReducer from './teamReducer';

const mainReducer = Redux.combineReducers({
  views: viewReducer,
  teams: teamReducer,
  rounds: roundsReducer,
  questions: questionReducer,
  room: roomReducer
})

export default mainReducer;