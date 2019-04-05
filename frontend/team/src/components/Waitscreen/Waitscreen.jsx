import React from "react";
import * as ReactRedux from "react-redux";

import "./Waitscreen.scss";
import { leaveGame } from './../../actions/gameActions';

class Waitingscreen extends React.Component {
    render() {
        return (
            <div className="Waitscreen Component">
                <nav>
                    <div className="navInner">
                        <div className="navLeft">
                            <button onClick={() => this.props.leaveGame(this.props.roomKey)}>Leave</button>
                        </div>
                        <div className="navMiddle">
                            <h2>Team: {this.props.teamName}</h2>
                        </div>
                        <div className="navRight">
                            <span>Room: {this.props.roomKey}</span>
                        </div>
                    </div>
                </nav>
                <main>
                    <div className="messageBox">
                        <h2>{getWaitingscreenMessage(this.props.accepted, this.props.rejected)}</h2>
                    </div>
                </main>
            </div>
        );
    }
}

function getWaitingscreenMessage(accepted, rejected) {
    if (!accepted && !rejected) {
        return "Waiting for approval from the quizmaster!";
    } else if (rejected) {
        return "The quizmaster rejected your request to join the game!";
    } else {
        return "The quizmaster approved your team! The quiz starts soon...";
    }
}

function mapStateToProps(state) {
    return {
        roomKey: state.game.roomKey,
        teamName: state.game.teamName,
        accepted: state.game.accepted,
        rejected: state.game.rejected
    };
}

function mapDispatchToProps(dispatch) {
    return {
        leaveGame: roomKey => dispatch(leaveGame(roomKey))
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Waitingscreen);
