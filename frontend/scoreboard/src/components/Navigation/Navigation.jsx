import React from 'react';
import * as reactRedux from 'react-redux';
import gameStates from '../../definitions/gameStates';

import './Navigation.scss';
import { leaveRoom } from '../../actions/gameActions';
import { viewLoginScreenAction } from '../../actions/viewActions';

class Navigation extends React.Component {
  leaveRoom(roomKey) {
    !roomKey ? this.props.viewLoginScreenAction() : this.props.leaveRoom(roomKey);
  }

  render() {
    return (
      <nav>
        <div className='navInner'>
          <div className='navLeft'>
            <button onClick={() => this.leaveRoom(this.props.roomKey)}>Leave</button>
          </div>

          {this.props.gameState === gameStates.REGISTER ? (
            <div className='navMiddle'>
              <h2>RoomKey: {this.props.roomKey}</h2>
            </div>
          ) : (
            <div className='navMiddle'>
              <h2>Question {this.props.currentQuestionIndex + 1}</h2>
              <h2>Round {this.props.currentRound}</h2>
            </div>
          )}

          <div className='navRight'>
            <span>
              {this.props.teams.length} {this.props.teams.length === 1 ? 'team' : 'teams'} connected
            </span>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    gameState: state.game.gameState,
    roomKey: state.game.roomKey,
    currentQuestionIndex: state.game.currentQuestionIndex,
    currentRound: state.game.currentRound,
    teams: state.game.teams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    leaveRoom: roomKey => dispatch(leaveRoom(roomKey)),
    viewLoginScreenAction: () => dispatch(viewLoginScreenAction())
  };
}

export default reactRedux.connect(mapStateToProps, mapDispatchToProps)(Navigation);
