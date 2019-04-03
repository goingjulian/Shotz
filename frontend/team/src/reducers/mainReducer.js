import * as Redux from "redux";
import viewReducer from "./viewReducer";
import gameReducer from './gameReducer';

export default Redux.combineReducers({
  views: viewReducer,
  game: gameReducer
});
