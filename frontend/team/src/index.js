import React from "react";
import ReactDOM from "react-dom";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";

import "./assets/scss/style.scss";
import mainReducer from "./reducers/mainReducer";
import ShotzTeam from "./components/ShotzTeam";

const store = Redux.createStore(mainReducer);

const RootComponent = (
  <ReactRedux.Provider store={store}>
    <ShotzTeam />
  </ReactRedux.Provider>
);

ReactDOM.render(RootComponent, document.getElementById("root"));
