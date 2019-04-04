import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import "./assets/scss/style.scss";
import mainReducer from "./reducers/mainReducer";
import ShotzTeam from "./components/ShotzTeam";
import { restoreSession } from "./actions/gameActions";

const store = createStore(mainReducer, applyMiddleware(thunk));

const RootComponent = (
  <Provider store={store}>
    <ShotzTeam />
  </Provider>
);

store.dispatch(restoreSession());
ReactDOM.render(RootComponent, document.getElementById("root"));
