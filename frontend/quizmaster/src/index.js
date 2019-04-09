import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./assets/scss/style.scss";
import App from './App';
import { restoreSession } from "./actions/roomActions";
// import store from './store';
import thunk from "redux-thunk";
import mainReducer from "./reducers/mainReducer";
import { createStore, applyMiddleware } from "redux";

export const store = createStore(mainReducer, applyMiddleware(thunk));

const RootComponent = (
  <Provider store={store}>
    <App />
  </Provider>
);

store.dispatch(restoreSession());
ReactDOM.render(RootComponent, document.getElementById("root"));