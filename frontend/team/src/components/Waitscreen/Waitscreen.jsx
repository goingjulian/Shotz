import React from "react";
import * as ReactRedux from "react-redux";

class Waitingscreen extends React.Component {
  render() {
    return (
      <div className="Waitscreen">
        <p>Waiting screen</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  Waitingscreen
);
