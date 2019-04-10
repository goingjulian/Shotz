import React from "react";
import * as ReactRedux from "react-redux";

import "./Navigation.scss";
import { viewLoginScreenAction } from "../../actions/viewActions";
import { leaveRoom } from "./../../actions/roomActions";

class Navigation extends React.Component {
  leaveRoom(roomKey) {
    !roomKey ? this.props.viewLoginScreenAction() : this.props.leaveRoom(roomKey);
  }

  render() {
    return (
      <nav>
        <div className="navInner">
          <div className="navLeft">
            <button onClick={() => this.leaveRoom(this.props.roomKey)}>End game</button>
          </div>
          {this.props.roomKey !== null && (
            <div className="navMiddle">
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
    roomKey: state.room.roomKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    leaveRoom: roomKey => dispatch(leaveRoom(roomKey)),
    viewLoginScreenAction: () => dispatch(viewLoginScreenAction())
  };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Navigation);
