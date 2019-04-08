import React from "react";
import * as ReactRedux from "react-redux";

import "./Message.scss";
import Navigation from "../Navigation/Navigation";

class Message extends React.Component {
    leaveRoom(roomKey) {
        !roomKey ? this.props.viewLoginScreenAction() : this.props.leaveGame(roomKey);
    }

    render() {
        return (
            <div className="Message Component">
                <Navigation />
                <main>
                    <div className="messageBox">
                        <h2>{this.props.messageScreenText}</h2>
                    </div>
                </main>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        roomKey: state.game.roomKey,
        messageScreenText: state.views.messageScreenText
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Message);
