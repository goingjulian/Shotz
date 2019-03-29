import * as Redux from "redux";
import viewReducer from "./viewReducer";

export default Redux.combineReducers({
  views: viewReducer
});
