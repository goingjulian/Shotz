import thunk from "redux-thunk";
import mainReducer from "./reducers/mainReducer";
import { createStore, applyMiddleware } from "redux";

const store = createStore(mainReducer, applyMiddleware(thunk));

export default store;