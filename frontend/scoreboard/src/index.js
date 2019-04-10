import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./assets/scss/style.scss";
import ShotzScoreBoard from "./components/ShotzScoreBoard";
import { restoreSession } from "./actions/gameActions";
import store from './store'

const RootComponent = (
  <Provider store={store}>
    <ShotzScoreBoard />
  </Provider>
);

store.dispatch(restoreSession());
ReactDOM.render(RootComponent, document.getElementById("root"));
