import React from "react";
import * as ReactRedux from "react-redux";

import QuestionInfo from "./QuestionInfo";
import QuestionQueue from "./QuestionQueue";
import Scoreboard from "./Scoreboard";

import './ControlPanel.scss';

class ControlPanel extends React.Component {
  render() {
    return (
      <div className="ControlPanel">
        <Scoreboard />
        <QuestionInfo />
        <QuestionQueue />
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
  ControlPanel
);
