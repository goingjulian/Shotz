import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./assets/scss/style.scss";
import ShotzScoreBoard from "./components/ShotzScoreBoard";
import { restoreSession } from "./actions/gameActions";
import thunk from "redux-thunk";
import mainReducer from "./reducers/mainReducer";
import { createStore, applyMiddleware } from "redux";

export const store = createStore(mainReducer, applyMiddleware(thunk));

const RootComponent = (
  <Provider store={store}>
    <ShotzScoreBoard />
  </Provider>
);

store.dispatch(restoreSession());
ReactDOM.render(RootComponent, document.getElementById("root"));
