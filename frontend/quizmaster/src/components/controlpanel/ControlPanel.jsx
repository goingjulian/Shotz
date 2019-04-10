import React from 'react';
import * as ReactRedux from 'react-redux';

import QuestionInfo from './QuestionInfo';
import QuestionQueue from './QuestionQueue';
import Scoreboard from './Scoreboard';
import { alterTeamAcceptedStatus } from '../../actions/teamActions';
import { removeQuestionFromQueue } from '../../actions/roundsActions';

import './ControlPanel.scss';
import Navigation from '../Navigation/Navigation';

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showScoreboard: true,
      showQueue: true
    };
  }

  toggleScoreboard() {
    const state = this.state.showScoreboard;
    this.setState({
      showScoreboard: !state
    })
  }

  toggleQueue() {
    const state = this.state.showQueue;
    this.setState({
      showQueue: !state
    })
  }

  render() {
    return (
      <div className='Component'>
        <Navigation />

        <nav className='navigationMobile'>
          <div className='toggleScoreboard' onClick={() => this.toggleScoreboard()}>
            <span>Scores</span>
          </div>
          <div className='toggleQueue' onClick={() => this.toggleQueue()}>
            <span>Queue</span>
          </div>
        </nav>

        <div className='ControlPanel'>
          <Scoreboard
            toggled={this.state.showScoreboard}
            teams={this.props.teams}
            removeTeam={teamSessionId => this.props.removeTeam(this.props.roomKey, teamSessionId)}
          />
          <QuestionInfo />
          <QuestionQueue
            toggled={this.state.showQueue}
            questions={this.props.rounds[this.props.rounds.length - 1].questions}
            currentQuestionIndex={
              this.props.rounds[this.props.rounds.length - 1].activeQuestionIndex
            }
            removeQuestionFromQueue={questionId =>
              this.props.removeQuestionFromQueue(this.props.roomKey, questionId)
            }
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
    removeTeam: (roomKey, sessionId) =>
      dispatch(alterTeamAcceptedStatus(roomKey, sessionId, false)),
    removeQuestionFromQueue: (roomKey, questionId) =>
      dispatch(removeQuestionFromQueue(roomKey, questionId))
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
