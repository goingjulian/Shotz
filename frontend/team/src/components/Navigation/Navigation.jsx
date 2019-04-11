import React from 'react';
import * as ReactRedux from 'react-redux';

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
          {this.props.roomKey !== null && (
            <div className='navMiddle'>
              <h2>Team: {this.props.teamName}</h2>
            </div>
          )}

          {this.props.roomKey !== null && (
            <div className='navRight'>
              <span>Room: {this.props.roomKey}</span>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    roomKey: state.game.roomKey,
    teamName: state.game.teamName
  };
}

function mapDispatchToProps(dispatch) {
  return {
    leaveRoom: roomKey => dispatch(leaveRoom(roomKey)),
    viewLoginScreenAction: () => dispatch(viewLoginScreenAction())
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Navigation);
