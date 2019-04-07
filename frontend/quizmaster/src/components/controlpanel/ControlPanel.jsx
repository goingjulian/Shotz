import React from "react";
import * as ReactRedux from "react-redux";

import QuestionInfo from "./QuestionInfo";
import QuestionQueue from "./QuestionQueue";
import Scoreboard from "./Scoreboard";
import { alterTeamAcceptedStatus } from '../../actions/teamActions';

import './ControlPanel.scss';

class ControlPanel extends React.Component {
  render() {
    console.log("ROUNDS CONTROL");
    return (
      <div className="Component">
        <nav>
          <div className="navInner">
            <div className="navLeft">
              <button>End quiz</button>
            </div>
            <div className="navMiddle">
              <h2>Room: {this.props.roomKey}</h2>
            </div>
          </div>
        </nav>
        <div className="ControlPanel">
          <Scoreboard
            teams={this.props.teams}
            removeTeam={(teamSessionId) => this.props.removeTeam(this.props.roomKey, teamSessionId)}
          />
          <QuestionInfo />
          <QuestionQueue
            questions={this.props.rounds[this.props.rounds.length - 1].questions}
            currentQuestionIndex={this.props.rounds[this.props.rounds.length - 1].activeQuestionIndex}
          />
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    roomKey: state.room.roomKey,
    rounds: state.rounds.rounds,
    teams: state.teams.teamList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeTeam: (roomKey, sessionId) => dispatch(alterTeamAcceptedStatus(roomKey, sessionId, false))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  ControlPanel
);
