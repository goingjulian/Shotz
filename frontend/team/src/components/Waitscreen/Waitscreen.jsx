import React from "react";
import * as ReactRedux from "react-redux";

import "./Waitscreen.scss";

class Waitingscreen extends React.Component {
    render() {
        return (
            <div className="Waitscreen Component">
                <nav>
                    <div className="navCloseGame">
                        <p>x</p>
                    </div>
                    <div className="navRoomKey">
                        <span>Room: {this.props.roomKey}</span>
                    </div>
                </nav>
                <main>
                    <p>{this.props.teamName}</p>
                </main>
            </div>
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
    return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Waitingscreen);
