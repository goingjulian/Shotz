import React from "react";
import * as ReactRedux from "react-redux";

import QuestionInfo from "./QuestionInfo";
import QuestionQueue from "./QuestionQueue";
import Scoreboard from "./Scoreboard";

import './ControlPanel.scss';

class ControlPanel extends React.Component {
  render() {
    console.log("ROUNDS CONTROL", this.props.rounds);
    return (
      <div className="ControlPanel">
        <Scoreboard 
          teams={this.props.teams}
        />
        <QuestionInfo />
        <QuestionQueue
          questions={this.props.rounds.currentRound.questions}
          currentQuestionIndex={this.props.rounds.currentQuestionIndex}
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
