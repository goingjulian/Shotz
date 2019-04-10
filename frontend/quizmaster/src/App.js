import React from "react";
import * as ReactRedux from "react-redux";

import Error from "./components/Error/Error.jsx";

function App(props) {
  return (
    <div className="App">
      <props.activeView />
      <Error />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    activeView: state.views.activeView
  };
}

export default ReactRedux.connect(mapStateToProps)(App);
