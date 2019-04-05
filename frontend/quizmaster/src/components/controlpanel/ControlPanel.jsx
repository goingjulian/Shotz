import React from "react";
import * as ReactRedux from "react-redux";

import QuestionInfo from "./QuestionInfo";
import QuestionQueue from "./QuestionQueue";
import Scoreboard from "./Scoreboard";

import './ControlPanel.scss';

class ControlPanel extends React.Component {
  render() {
    console.log("ROUNDS CONTROL");
    return (
      <div className="ControlPanel">
        <Scoreboard 
          teams={this.props.teams}
        />
        <QuestionInfo />
        <QuestionQueue
          questions={this.props.rounds[this.props.rounds.length - 1].questions}
          currentQuestionIndex={this.props.rounds[this.props.rounds.length - 1].activeQuestionIndex}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rounds: state.rounds.rounds,
    teams: state.teams.teamList
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  ControlPanel
);
