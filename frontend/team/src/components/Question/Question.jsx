import React from "react";
import * as ReactRedux from "react-redux";

import "./Question.scss";
import { leaveGame } from "../../actions/gameActions";

function Question(props) {
    return (
        <div className="Component Question">
            <nav>
                <div className="navInner">
                    <div className="navCloseGame">
                        <button onClick={() => this.props.leaveGame(props.roomKey)}>Leave</button>
                    </div>
                    <div className="navTeamName">
                        <span>Team: {props.teamName}</span>
                    </div>
                    <div className="navRoomKey">
                        <span>Room: {props.roomKey}</span>
                    </div>
                </div>
            </nav>
            <main>
                <p>Hello world</p>
            </main>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        roomKey: state.game.roomKey,
        teamName: state.game.teamName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        leaveGame: roomKey => dispatch(leaveGame(roomKey))
    };
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Question);
